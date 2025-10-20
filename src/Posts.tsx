/*
 * (#)Posts.tsx 0.1.0   10/19/2025
 *
 * @author  Jonathan Parker
 * @version 0.1.0
 * @since   0.1.0
 *
 * MIT License
 *
 * Copyright (c) 2025 Jonathan M. Parker
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { JSX } from "react";
import type { PostsProps } from "./types/PostsProps.tsx";

import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * The posts component.
 *
 * @param   {Readonly<PostsProps>}  props           The props for the component.
 * @return                          {JSX.Element}
 */
export default function Posts({ getUrl, postUrl, deleteUrl }: Readonly<PostsProps>): JSX.Element {
    /** The naviaget function. */
    const navigate = useNavigate();

    /**
     * The interface for the post.
     */
    interface Post {
        userId: number, /* The user IDs are always 1 */
        id: number;
        title: string;
        body: string;
    }

    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect((): void => {
        /**
         * Fetches the posts from the server.
         */
        const fetchPosts: () => Promise<void> = async (): Promise<void> => {
            try {
                const response: Response = await fetch(getUrl);
                const posts: Post[] = await response.json();

                setPosts(posts);
            } catch (error) {
                console.log(error);
            }
        }

        fetchPosts().finally();
    }, [getUrl]);

    /**
     * Adds a post to the server.
     *
     * @param   {string}  title   The title of the post.
     * @param   {string}  body    The body of the post.
     * @return            {Promise<void>}
     */
    const addPost: (title: string, body: string) => Promise<void> = async (title: string, body: string): Promise<void> => {
        try {
            const response: Response = await fetch(postUrl, {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    body: body,
                    userId: Math.random().toString(36).slice(2),
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            const post: Post = await response.json();

            setPosts((posts: Post[]): Post[] => [post, ...posts]);
            setTitle('');
            setBody('');
        } catch (error) {
            console.log(error);
        }
    };

    const deletePost: (id: number) => Promise<void> = async (id: number): Promise<void> => {
        const url: string = `${deleteUrl}/${id}`;

        try {
            const response: Response = await fetch(url, {
                method: 'DELETE'
            });

            if (response.status === 200) {
                setPosts(
                    posts.filter(post => {
                        return post.id !== id;
                    })
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const editPost: (id: number) => Promise<void> = async (id: number): Promise<void> => {
        navigate(`/edit?id=${id}`, { replace: true });
    };

    const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        addPost(title, body).finally();
    };

    return (
        <div>
            <div>
                <form className="form-container" onSubmit={ handleSubmit }>
                    <div className="form-group">
                        <label htmlFor="title" className="form-group-label">Title</label>
                        <input
                            type="text"
                            id="title"
                            className="form-input"
                            value={ title }
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="body" className="form-group-label">Body</label>
                        <textarea
                            id="body"
                            className="form-input"
                            value={ body }
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Add Post
                    </button>
                </form>
            </div>
            <div>
                {posts.map(post => {
                    return (
                        <div key={ post.id }>
                            <hr />
                            <h2>{ post.title }</h2>
                            <p>{ post.body }</p>
                            <div className="fixed-button-group">
                                <button
                                    className="fixed-button"
                                    onClick={ (): Promise<void> => editPost(post.id) }
                                >
                                    Edit
                                </button>
                                <button
                                    className="fixed-button"
                                    onClick={ (): Promise<void> => deletePost(post.id) }
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
