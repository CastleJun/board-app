import type { NextPage } from 'next';
import Link from "next/link";
import useSWR from "swr";
import { Sub } from "../types";
import axios from "axios";
import Image from "next/image";
import { useAuthState } from "../context/auth";

const Home: NextPage = () => {
  const { authenticated } = useAuthState();

  const address = "http://localhost:4000/api/subs/sub/topSubs";

  const { data: topSubs } = useSWR<Sub[]>(address);

  console.log(topSubs);
  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-8/12">

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