import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import { IncomingForm, File } from "formidable";
import FormData from "form-data";
import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false, // Required for formidable to handle the form data
  },
};

interface ResultBody {
  status: string;
  message: string;
  text?: string;
  error?: string;
}

type ProcessedFiles = Array<[string, File]>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let status = 200;
  let resultBody: ResultBody = {
    status: "ok",
    message: "Files were uploaded successfully",
  };

  const files = await new Promise<ProcessedFiles | undefined>(
    (resolve, reject) => {
      const form = new IncomingForm(); // Correctly initialize IncomingForm
      const files: ProcessedFiles = [];
      form.on("file", (field, file) => {
        files.push([field, file]);
      });
      form.on("end", () => resolve(files));
      form.on("error", (err) => reject(err));
      form.parse(req);
    },
  ).catch((e) => {
    console.error("Formidable Error:", e);
    status = 500;
    resultBody = {
      status: "fail",
      message: "Upload error",
    };
  });

  if (files?.length) {
    const targetPath = path.join(process.cwd(), "/uploads/");
    try {
      await fsp.access(targetPath);
    } catch (e) {
      await fsp.mkdir(targetPath);
    }

    const file = files[0];
    const tempPath = file[1].filepath;
    const targetFilePath = path.join(
      targetPath,
      file[1].originalFilename || "audio.wav",
    );
    await fsp.rename(tempPath, targetFilePath);

    try {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(targetFilePath), "audio.wav");
      formData.append("model", "whisper-1");

      console.log({ formData });

      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: formData,
        },
      );

      const result = await response.json();
      if (response.ok) {
        resultBody = {
          status: "ok",
          message: "Transcription successful",
          text: result.text,
        };
      } else {
        console.error("OpenAI Whisper Error:", result.error);
        status = 500;
        resultBody = {
          status: "fail",
          message: "Error from OpenAI Whisper",
          error: result.error,
        };
      }
    } catch (error) {
      console.error("Internal Server Error:", error);
      status = 500;
      resultBody = {
        status: "fail",
        message: "Internal Server Error",
        error: String(error),
      };
    } finally {
      await fsp.unlink(targetFilePath);
    }
  }

  res.status(status).json(resultBody);
}
