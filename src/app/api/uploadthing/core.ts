import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; 

const f = createUploadthing();

const handleAuth = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new UploadThingError("Unauthorized");
  }

  return { userId: session.user.id };
};

export const ourFileRouter = {
  courseImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const authData = await handleAuth();
      return authData;
    })
    .onUploadComplete(() => {}),

 courseAttachment: f(["text", "image", "video", "audio", "pdf"])
 .middleware(async () => {
      const authData = await handleAuth();
      return authData;
    })
    .onUploadComplete(() => {}),

    chapterVideo: f({video: {maxFileCount: 1, maxFileSize: "512GB"}})
    .middleware(async () => {
      const authData = await handleAuth();
      return authData;
    })
    .onUploadComplete(() => {}),


    
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
