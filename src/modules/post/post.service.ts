import type { IPost } from "./interfaces/post.interface.js";
import PostRepository from "./post.repository.js";

class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getAllPosts(
    page: number,
    limit: number,
    search: string | undefined = undefined,
  ): Promise<IPost[]> {
    return await this.postRepository.findAll(page, limit, search);
  }

  async getPostById(id: number): Promise<IPost | null> {
    return await this.postRepository.findById(id);
  }

  async createPost(
    post: Omit<
      IPost,
      "id" | "createdAt" | "updatedAt" | "updatedBy" | "isActive"
    >,
  ): Promise<IPost> {
    const newPost = Object.assign(post, {
      createdAt: new Date(),
      isActive: true,
    });

    return await this.postRepository.create(newPost);
  }

  async editPostById(
    id: number,
    updatedFields: Partial<Omit<IPost, "id" | "createdAt">>,
  ): Promise<IPost> {
    return await this.postRepository.editById(id, updatedFields);
  }

  async deletePostById(id: number): Promise<boolean> {
    return await this.postRepository.deleteById(id);
  }
}

export default PostService;
