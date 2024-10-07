"use client";

import { Flow } from "@/types/koxy";
import { FlowStore } from "@/utils/flow";
import { useEffect, useState } from "react";
import NodeComp from "./node";
import dynamic from "next/dynamic";
import { CodeGenerator } from "@/utils/code-generator";

const Editor = dynamic(() => import("./editor/Editor"));

interface Props {
  path: string;
  flow: Flow;
}

const stores: Record<string, FlowStore> = {};

export default function Canvas({ path, flow }: Props) {
  const [store, setStore] = useState<FlowStore>(new FlowStore(flow));
  const [data, setData] = useState<Flow>();

  useEffect(() => {
    const flowPath = `${path}/${flow.id}`;

    if (!stores[flowPath]) {
      const newStore = new FlowStore(flow, () => setData(flow));
      stores[flowPath] = newStore;
      setStore(stores[flowPath]);
    } else {
      setStore(stores[flowPath]);
      setData(stores[flowPath].flow);
    }
  }, [flow]);

  const generator = new CodeGenerator(
    "const main = (name: string): string => (<<KOXY_INSERT_VALUE>>)"
  );

  /**<<KOXY_INSERT_VALUE>>

    const main = (): string => variable; */

  if (!data) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <NodeComp
        node={data.start}
        store={store}
        path={path}
        update={(d: Flow) => {
          store.set(d);
          setData(d);
        }}
      />

      {data.nodes.map((node, index) => (
        <div key={`node-${node.id}-${index}`}>
          <NodeComp
            node={node}
            store={store}
            path={path}
            update={(d: Flow) => store.set(d)}
          />
        </div>
      ))}

      <NodeComp
        node={data.end}
        store={store}
        path={path}
        update={(d: Flow) => store.set(d)}
      />
      <Editor generator={generator} />
    </div>
  );
}
