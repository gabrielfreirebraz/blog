"use client";
import React, { useEffect, useState } from 'react'

// import { CommentSection} from 'react-comments-section'
import 'react-comments-section/dist/index.css'
import axios from 'axios';
import dynamic from 'next/dynamic';


const CommentSection = dynamic(() => import('react-comments-section').then(mod => mod.CommentSection), {
    ssr: false,
    loading: () => <p>Carregando comentários...</p>, 
});

export const BlogPostCommentSection = ({ postId }: { postId: string }) => {

    const [comments, setComments] = useState<CommentDataLibrary[]>([]);
    const [newComment, setNewComment] = useState<CommentDataLibrary | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = async () => {
        try {
            const { data }: { data: CommentDataApi[] } = await axios.get(`/api/comments`, {
                params: { postId }
            });
            
            setComments(() => {
                const newData: CommentDataLibrary[] = data.map((currData: CommentDataApi) => (
                        {
                            postId: currData.post_id,
                            comId: currData.comment_id,
                            userId: currData.user_id,
                            avatarUrl: currData.avatar_url,
                            userProfile: currData.user_profile,
                            fullName: currData.full_name,
                            text: currData.text,
                            replies: currData.replies ?? [],
                            timestamp: currData.created_at
                        }
                    )
                )

                return newData
            });
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError('Failed to load comments');
        } 
    };

    useEffect(() => {

        fetchComments();
    }, []);


    useEffect(() => {

        if (newComment) {
        
            const newCommentToInsert: CommentDataApi = {
                post_id: postId,
                comment_id: newComment.comId,
                user_id: newComment.userId,
                avatar_url: newComment.avatarUrl,
                user_profile: newComment.userProfile,
                full_name: newComment.fullName,
                text: newComment.text,
                replies: newComment.replies ?? [],
                created_at: new Date().toISOString(),
            } as CommentDataApi

            axios.post(`/api/comments`, newCommentToInsert).then(() => {
                setNewComment(null)
            });

            console.log(`check insert`, newCommentToInsert)
        }
        
    }, [newComment]);

    

    if (error) return <p>{error}</p>;

    return <div className='lg:mx-[6%] xl:mx-32 my-20'>
            <CommentSection
                currentUser={{
                    currentUserId: '01a',
                    currentUserImg:
                        'https://ui-avatars.com/api/name=GabrielBraz&background=random',
                    currentUserProfile:
                        'https://www.linkedin.com/in/gabrielfreirebraz/',
                    currentUserFullName: 'Gabriel Braz'
                }}
                advancedInput={true}
                hrStyle={{ border: 'none' }}
                commentData={comments}
                logIn={{
                    onLogin: () => alert("Call login function"),
                    signUpLink: 'http://localhost:3000/'
                }}
                placeHolder={"Write a comment..."}
                // customImg='/images/user-avatar.png'
                formStyle={{ 
                    backgroundColor: 'transparent', 
                    paddingTop: '0px', 
                    paddingBottom: '35px', 
                }}
                inputStyle={{
                    border: '1px solid rgb(208 208 208)',
                    borderRadius: '5px',
                    padding: '10px',
                    marginRight: '10px'
                }}
                submitBtnStyle={{
                    border: '1px solid black',
                    borderRadius: '5px',
                    backgroundColor: 'black',
                    padding: '7px 15px 5px',
                    fontWeight: 'normal',
                    fontSize: '14px'
                }}
                cancelBtnStyle={{
                    border: '1px solid #efeded',
                    borderRadius: '5px',
                    backgroundColor: '#efeded',
                    color: '#000',
                    padding: '7px 15px 5px',
                    fontWeight: 'normal',
                    fontSize: '14px'
                }}
                replyInputStyle={{ 
                    borderBottom: '1px solid black', 
                    color: 'black' 
                }}
                imgStyle={{
                    borderRadius: '5px',
                    height: '32px',
                    width: '34px',
                    marginTop: '15px'
                }}
                onSubmitAction={(data: CommentDataLibrary) => {

                    setNewComment(data)
                    console.log('check submit, ', data)
                }}
                currentData={(data: any) => {
                    console.log('current data', data)
                }}
            />
        </div>
}
  