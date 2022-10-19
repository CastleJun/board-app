import { Request, Response, Router } from 'express';
import userMiddleware from '../middlewares/user';
import { User } from "../entities/User";
import Post from "../entities/Post";
import Comment from "../entities/Comment";

const router = Router();
const getUserData = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = await User.findOneOrFail({
      where: {
        username,
      },
      select: ['username', 'createAt']
    });

    const posts = await Post.find({
      where: {
        username: user.username
      },
      relations: ['comments', 'votes', 'sub']
    });

    const comments = await Comment.find({
      where: {
        username: user.username
      },
      relations: ['post']
    });

    const localUser = res.locals.user;
    if (localUser) {
      posts.forEach(post => post.setUserVote(localUser));
      comments.forEach(comment => comment.setUserVote(localUser));
    }

    let userData = [];

    //class형태의 데이터가 들어가지 않음으로 {} 를 바꿔서 넣어줌.
    posts.forEach(post => userData.push({ type: "Post", ...post.toJSON() }));
    comments.forEach(comment => userData.push({ type: "Comment", ...comment.toJSON() }));

    userData.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1;
      if (b.createdAt < a.createdAt) return -1;
      return 0;
    });

    return res.json({ user, userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '문제가 발생했습니다.' });
  }

};

router.get('/:username', userMiddleware, getUserData);

export default router;