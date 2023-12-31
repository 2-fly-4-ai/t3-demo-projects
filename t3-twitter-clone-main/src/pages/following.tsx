import { Tweet } from "@prisma/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useScrollPosition from "../../hooks/useScrollPosition";
import { TweetWithUser } from "../../interface";
import Body from "../components/Body";
import CreateTweet from "../components/CreateTweet";
import HomeNav from "../components/HomeNav";
import Loader from "../components/Loader";
import TweetList from "../components/TweetList";
import { trpc } from "../utils/trpc";

const FollowingOnlyTweetsPage = () => {
  const scrollPosition = useScrollPosition();
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } =
    trpc.tweet.getFollowingInfiniteTweets.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition, isFetching, hasNextPage, fetchNextPage]);

  const tweets = data?.pages.flatMap((page) => page.followingTweets) ?? [];
  console.log(tweets)
  const router = useRouter();
  const { data: session, status } = useSession();
  return (
    <Body>
      <Head>
        <title>Following / Twitter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeNav />
      {status === "authenticated" ? <CreateTweet /> : null}
      {isLoading ? (
          <Loader />
        ) : (
          <>
            <TweetList tweets={tweets as TweetWithUser[]} />
          </>
        )}
        {isFetching && hasNextPage ? <Loader /> : null}
        {(!hasNextPage && !isFetching) ? (
          <p className="text-center text-gray-500">End of feed</p>
        ) : null}
    </Body>
  );
};

export default FollowingOnlyTweetsPage;
