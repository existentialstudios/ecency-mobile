import { renderPostBody } from '@ecency/render-helper';
import { Platform } from 'react-native';
import { makeJsonMetadataReply } from '../../utils/editor';
import {
    UPDATE_VOTE_CACHE,
    PURGE_EXPIRED_CACHE,
    UPDATE_COMMENT_CACHE,
    DELETE_COMMENT_CACHE_ENTRY
  } from '../constants/constants';
import { Comment, Vote } from '../reducers/cacheReducer';


  
  
  export const updateVoteCache = (postPath:string, vote:Vote) => ({
      payload:{
          postPath,
          vote
      },
      type: UPDATE_VOTE_CACHE
    })


    interface CommentCacheOptions {
      isUpdate?:boolean;
      parentTags?:Array<string>;
    }

  export const updateCommentCache = (commentPath:string, comment:Comment, options:CommentCacheOptions = {isUpdate:false}) => {

    console.log("body received:", comment.markdownBody);
    const updated = new Date();
    updated.setSeconds(updated.getSeconds() - 5); //make cache delayed by 5 seconds to avoid same updated stamp in post data
    const updatedStamp = updated.toISOString().substring(0, 19); //server only return 19 character time string without timezone part
    
    if(options.isUpdate && !comment.created){
      throw new Error("For comment update, created prop must be provided from original comment data to update local cache");
    }

    if(!options.parentTags && !comment.json_metadata){
      throw new Error("either of json_metadata in comment data or parentTags in options must be provided");
    }

    comment.created = comment.created || updatedStamp;  //created will be set only once for new comment;
    comment.updated = comment.updated || updatedStamp;
    comment.expiresAt = comment.expiresAt || updated.getTime() + 6000000;//600000;
    comment.active_votes = comment.active_votes || [];
    comment.net_rshares = comment.net_rshares || 0;
    comment.author_reputation = comment.author_reputation || 25;
    comment.total_payout = comment.total_payout || 0;
    comment.json_metadata = comment.json_metadata || makeJsonMetadataReply(options.parentTags)

    comment.body = renderPostBody({
      author:comment.author,
      permlink:comment.permlink,
      last_update:comment.updated,
      body:comment.markdownBody,
    }, true, Platform.OS === 'android');

    return ({
        payload:{
          commentPath,
          comment
        },
        type: UPDATE_COMMENT_CACHE
      })
    }

  export const deleteCommentCacheEntry = (commentPath:string) => ({
    payload:commentPath,
    type: DELETE_COMMENT_CACHE_ENTRY
  })
  
  export const purgeExpiredCache = () => ({
    type: PURGE_EXPIRED_CACHE
  })
  
  