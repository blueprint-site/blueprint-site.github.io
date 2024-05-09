import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import nbt from "prismarine-nbt";
import { SchematicData, useSchematicStore } from "../store/schematic";

import * as fflate from 'fflate';

export function useSchematic() {
  const [file, setFile] = useState<File | null>(null);
  const { setSchematic } = useSchematicStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function loadNbt() {
      try {
        setSchematic([]);
        setLoading(true);
        if (file) {
          const buffer = await file.arrayBuffer();
          const stringBuffer = new Uint8Array(buffer);
          const decompressed = fflate.decompressSync(stringBuffer);
          const data = nbt.parseUncompressed(Buffer.from(decompressed.buffer));
          console.log(data);
          if (
            data.value.blocks !== undefined &&
            data.value.palette !== undefined
          ) {
            // @ts-expect-error types from prismarine-nbt are not accurate
            const blocks = data.value.blocks.value.value;
            // @ts-expect-error types from prismarine-nbt are not accurate
            const palette = data.value.palette.value.value;
            // @ts-expect-error types from prismarine-nbt are not accurate
            const refinedData: Array<SchematicData> = blocks.map((block) => {
              const { pos, state } = block;
              const { Name } = palette[state.value];
              return {
                pos: pos.value.value,
                block: Name.value,
              };
            });
            console.log(refinedData);
            setSchematic(refinedData);
          }
        }
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (file !== null) {
      loadNbt();
    }
  }, [file]);

  return { setFile, loading, error };
}