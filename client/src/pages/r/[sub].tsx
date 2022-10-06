import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { NextPage } from "next";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import { useAuthState } from "../../context/auth";


const SubPage: NextPage = () => {
  const [ownSub, setOwnSub] = useState<boolean>(false);
  const { authenticated, user } = useAuthState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetcher = async (url: string) => {
    try {
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      console.warn(error);
    }
  };

  const router = useRouter();
  const subName = router.query.sub;
  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null, fetcher);

  useEffect(() => {
    if (!sub || !user) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [authenticated, sub, user]);

  const handleUploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    if (!fileInputRef.current) return;

    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileInputRef.current.name);

    try {
      await axios.post(`/subs/${sub.name}/upload`, formData, {
        headers: {
          "Context-Type": "multipart/form-data"
        }
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const handleOpenFileInput = (type: string) => {
    if (!ownSub) return;

    return () => {
      const fileInput = fileInputRef.current;
      if (fileInput) {
        fileInput.name = type;
        fileInput.click();
      }
    };
  };

  return (
    <>
      {sub &&
        <>
          <div>
            <input type="file" hidden ref={fileInputRef} onChange={handleUploadImage}/>
            <div className="bg-gray-400">
              {sub.bannerUrl ? (
                  <div
                    className="h-56"
                    style={{
                      backgroundImage: `url(${sub.bannerUrl})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    onClick={handleOpenFileInput("banner")}
                  >
                    test123
                  </div>
                ) :
                (
                  <div className="h-20 bg-gray-400">

                  </div>
                )
              }
            </div>
            <div className="h-20 bg-white">
              <div className="relative flex max-w-5xl px-5 mx-auto">
                <div className="absolute" style={{ top: -15 }}>
                  {sub.imageUrl && (
                    <Image
                      src={sub.imageUrl}
                      alt="커뮤니티 이미지"
                      width={70}
                      height={70}
                      className="rounded-full"
                      onClick={handleOpenFileInput("image")}
                    />
                  )}
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold">
                      {sub.title}
                    </h1>
                  </div>
                  <p className="text-sm font-bold text-gray-400">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex max-w-5xl px-4 pt-5 mx-auto">
            test
          </div>
        </>
      }
    </>
  );
};

export default SubPage;