import type { NextPage } from 'next';
import Link from "next/link";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { Post, Sub } from "../types";
import Image from "next/image";
import { useAuthState } from "../context/auth";
import PostCard from "../components/base-component/post-card";
import { useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
  const { authenticated } = useAuthState();

  const address = `/subs/sub/topSubs`;

  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) {
      return null;
    }

    return `/posts?page=${pageIndex}`;
  };

  const { data, isValidating, error, setSize: setPage, size: page, mutate } = useSWRInfinite<Post[]>(getKey);
  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];

  const { data: topSubs } = useSWR<Sub[]>(address);

  const [observedPost, setObservedPost] = useState('');

  useEffect(() => {
    if (!posts || posts.length === 0) {
      return;
    }
    const id = posts[posts.length - 1].identifier;
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {

          setPage(page + 1);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };
  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-8/12">
        {isInitialLoading && <p className="text-lg text-center">...loading</p>}
        {posts?.map((post) => {
          return <PostCard post={post} key={post.identifier} mutate={mutate}/>;
        })}
      </div>

      <div className="hidden w-4/12 ml-3 md:block">
        <div className="bg-white border rounded">
          <div className="p-4 border-b">
            <p className="text-lg font-semibold text-center">상위 커뮤니티</p>
          </div>

          <div>
            {topSubs?.map((sub) => {
              return (
                <div key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b">
                  <Link href={`/r/${sub.name}`}>
                    <a>
                      <Image
                        src={sub.imageUrl}
                        className="rounded-full cursor-pointer"
                        alt="Sub"
                        width={24}
                        height={24}
                      />
                    </a>
                  </Link>
                  <Link href={`/r/${sub.name}`}>
                    <a className="ml-2 font-bold hover:cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-medium">{sub.postCount}</p>
                </div>
              );
            })}
          </div>
          {authenticated &&
            <div className="w-full py-6 text-center">
              <Link href={'/subs/create'}>
                <a className="w-full p-2 text-center text-white bg-gray-400 rounded">
                  커뮤니티 만들기
                </a>
              </Link>
            </div>}
        </div>
      </div>
    </div>
  );
};

export default Home;