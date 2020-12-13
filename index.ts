import axios from "axios";

interface IScene {
  _id: string;
  name: string;
}

async function getScenePage(
  page: number
): Promise<{ items: IScene[]; numItems: number }> {
  const res = await axios.post("http://localhost:4000/ql?password=xxx", {
    query: `
      query($query: SceneSearchQuery!, $seed: String) {
        getScenes(query: $query, seed: $seed) {
          items {
            _id
            name
            # TODO: add more fields if needed
          }
          numItems
        }
      }
    `,
    variables: {
      query: {
        query: "",
        page,
        sortDir: "desc",
        sortBy: "addedOn",
      },
    },
  });
  return res.data.data.getScenes;
}

async function foreachScene(func: (scenes: IScene) => Promise<void>) {
  let numScenes = -1;
  let more = true;

  for (let page = 0; more; page++) {
    const { items, numItems } = await getScenePage(page);

    if (items.length) {
      for (const scene of items) {
        await func(scene);
      }
    } else {
      more = false;
      numScenes = numItems;
    }
  }

  console.log(`Visited ${numScenes} scenes`);
}

async function processScene(scene: IScene) {
  console.log(scene);
  // TODO: implement
}

(async () => {
  await foreachScene(processScene);
  process.exit(0);
})();
