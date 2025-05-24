import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new post
export const createPost = async (
  req: Request & { userId?: string },
  res: Response
) => {
  const { content, image } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        authorId: req.userId!, // fixed: authorId not userId
        content,
        imageUrl: image, // fixed: imageUrl not image
      },
    });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create post" });
  }
};

// Get feed (latest posts first)
export const getFeed = async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
      },
    });
    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to fetch feed" });
  }
};

// Like or unlike a post
export const likePost = async (
  req: Request & { userId?: string },
  res: Response
) => {
  const postId = req.params.id;
  const userId = req.userId!;

  try {
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: { postId, userId },
      });
    }

    const updatedLikes = await prisma.like.findMany({
      where: { postId },
    });

    return res.json({ message: "Updated likes", likes: updatedLikes });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update like" });
  }
};

// Comment on a post
export const commentOnPost = async (
  req: Request & { userId?: string },
  res: Response
) => {
  const postId = req.params.id;
  const { content } = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: req.userId!,
        content,
      },
    });

    return res.status(201).json(comment);
  } catch (err) {
    return res.status(500).json({ error: "Failed to add comment" });
  }
};

// Update a post
export const updatePost = async (
  req: Request & { userId?: string },
  res: Response
) => {
  const postId = req.params.id;
  const { content, image } = req.body;

  try {
    // Find the post first
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if the current user is the author
    if (post.authorId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
        imageUrl: image,
      },
    });

    return res.json(updatedPost);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update post" });
  }
};

// Delete a post
export const deletePost = async (
  req: Request & { userId?: string },
  res: Response
) => {
  const postId = req.params.id;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.authorId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.post.delete({ where: { id: postId } });

    return res.json({ message: "Post deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete post" });
  }
};
