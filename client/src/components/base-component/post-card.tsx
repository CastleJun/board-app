import React from 'react';
import { Post } from "../../types";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useAuthState } from "../../context/auth";
import { useRouter } from "next/router";
import axios from "axios";

interface Props {
  post: Post;
  mutate?: () => void;
}

const PostCard: React.FC<Props> = (props) => {
  const { post, mutate } = props;
  const {
    identifier,
    slug,
    commentCount,
    sub,
    body,
    title,
    subName,
    createdAt,
    username,
    url,
    userVote,
  } = post;

  const { authenticated } = useAuthState();
  const router = useRouter();
  const isInSubPage = router.pathname === '/r/[sub]';

  const vote = async (value: number) => {
    if (!authenticated) {
      return router.push('/login');
    }

    if (value === userVote) {
      value = 0;
    }

    try {
      await axios.post('/votes', { identifier, slug, value });
      if (mutate) {
        mutate();
      }
    } catch (error) {
      console.warn(error);
    }
  };


  return (
    <div className="flex mb-4 bg-white rounded" id={identifier}>
      <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
        <div
          className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          {userVote === 1 ?
            <FaArrowUp className="mx-auto text-red-500"/>
            : <FaArrowUp/>
          }

        </div>
        <p className="text-xs font-bold">{userVote}</p>
        <div
          className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          {userVote === -1 ?
            <FaArrowDown className="mx-auto text-blue-500"/>
            : <FaArrowDown/>
          }
        </div>
      </div>

      <div className="w-full p-2">
        <div className="flex items-center">
          {!isInSubPage && (
            sub &&
            <div className="flex items-center">
              <Link href={`/r/${subName}`}>
                <a>
                  <Image
                    src={sub?.imageUrl}
                    alt="sub"
                    className="rounded-full cursor-pointer"
                    width={12}
                    height={12}/>
                </a>
              </Link>

              <Link href={`/r/${subName}`}>
                <a className="ml-2 text-xs font-bold cursor-pointer hover:underline">
                  /r/{subName}
                </a>
              </Link>
              <span className="mx-1 text-xs text-gray-400">•</span>
            </div>
          )}

          <p className="text-xs text-gray-400">
            Posted by
            <Link href={`/u/${username}`}>
              <a className="mx-1 hover:underline">/u/${username}</a>
            </Link>
            <Link href={url}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
              </a>
            </Link>
          </p>
        </div>

        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <Link href={url}>
            <a>
              <i className="mr-1 fas fa-comment-alt fa-xs"/>
              <span>{commentCount}</span>
            </a>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default PostCard;
