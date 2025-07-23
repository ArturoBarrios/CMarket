export function calculateJokeStats(likeObjects: Array<{ liked: boolean }>, 
                retweetObjects: Array<{ retweeted: boolean }>) {
  const likes = likeObjects.filter(obj => obj.liked === true).length
  const dislikes = likeObjects.filter(obj => obj.liked === false).length
  const retweets = retweetObjects.filter(obj => obj.retweeted === true).length

  return {
    likes,
    dislikes,
    retweets
  }
}

export function processJokeWithStats(joke: any, userId: string) {
  const { likes, dislikes, retweets } = calculateJokeStats(joke.likeObjects || [], joke.retweetObjects || [])
  
  let userLiked = false
  let userRetweeted = false
  
  if (userId) {
    //   console.log("User like status:", userId)
    const userStatus = getUserLikeStatus(joke.likeObjects || [], userId)
    userLiked = userStatus.hasLiked
    
    // console.log("joke.retweetedObjects: ", joke.retweetObjects)
    
    const userRetweetedStatus = getUserRetweetedStatus(joke.retweetObjects || [], userId)
    userRetweeted = userRetweetedStatus.hasRetweeted
    
  }
  
  
  
  return {
    ...joke,
    likes,
    retweets,
    dislikes,
    userLiked,
    userRetweeted
  }
}

export function getUserRetweetedStatus(retweetedObjects: Array<{ userId: string, retweeted: boolean }>, userId: string) {
  const userRetweet = retweetedObjects.find(obj => obj.userId === userId)
  if(userRetweet){
    console.log("User retweet found:", userRetweet)
    console.log("obj: ", userRetweet.userId)
  }
  return {
    hasRetweeted: userRetweet?.retweeted === true,    
  }
}

export function getUserLikeStatus(likeObjects: Array<{ userId: string, liked: boolean }>, userId: string) {
  const userLike = likeObjects.find(obj => obj.userId === userId)
  if(userLike){
    console.log("User like found:", userLike)
    console.log("obj: ", userLike.userId)
  }
  return {
    hasLiked: userLike?.liked === true,
    hasDisliked: userLike?.liked === false,
    userLikeExists: !!userLike,
    currentLikeValue: userLike?.liked
  }
}
