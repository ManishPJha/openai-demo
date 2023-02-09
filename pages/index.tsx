import type { NextPage } from "next";
import { useState } from "react";
import Typewriter from "typewriter-effect";

const Home: NextPage = () => {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const number_of_images = 2; //The number of images to generate.

  const onClick = async ({ type = null }: { type: string | null }) => {
    if (type === null) return null;

    try {
      setLoading(true);

      setType(type);

      const response = await fetch(
        `/api/openai/${type}?_total=${number_of_images}`,
        {
          method: "post",
          body: JSON.stringify({
            input: input,
          }),
        }
      );

      const json = await response.json();

      setReply(json.data);
      setLoading(false);
    } catch (error: any) {
      console.log(">>>", error);
      window.alert(error.message);
      setLoading(false);
    }
  };

  const PrintImages = () => {
    return reply ? (
      <div>
        {/* {Array(number_of_images)
          .fill({ url: reply })
          .map((image, index) => {
            return <img src={image.url} alt="" key={index} />;
          })} */}
        <img src={reply} alt="openai-image" />
      </div>
    ) : null;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col items-center gap-y-5 mt-5">
        <textarea
          placeholder="question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="text-2xl border text-center hover:bg-gray-100"
        ></textarea>
        <div className="flex gap-x-5">
          <button
            className="btn btn-outline btn-primary w-1/2 rounded-lg h-10"
            onClick={() => onClick({ type: "complete" })}
          >
            Ask
          </button>
          <button
            className="btn btn-outline btn-primary w-1/2 rounded-lg h-10"
            onClick={() => onClick({ type: "generate" })}
          >
            Generate
          </button>
        </div>
        <div className="flex gap-x-5 w-full items-center justify-center">
          <button
            className="btn btn-outline btn-error w-1/2 rounded-lg h-10"
            onClick={() => {
              // reset
              setReply("");
              setInput("");
              setType("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <span>{loading ? "loading..." : null}</span>

      <div
        className={`w-1/2 border px-5 mt-5 mb-5 ${
          type !== "complete" ? "flex justify-center items-center" : null
        }`}
      >
        {reply && type === "complete" ? (
          <Typewriter
            options={{
              wrapperClassName: "ai-writer text-sm slate-500",
              delay: 80, // to controll speed
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString(reply)
                .callFunction(() => {
                  console.log("String typed out!");
                })
                // .pauseFor(2500)
                // .deleteAll()
                // .callFunction(() => {
                //   console.log("All strings were deleted");
                // })
                .start();
            }}
          />
        ) : (
          <PrintImages />
        )}
      </div>
    </div>
  );
};

export default Home;
