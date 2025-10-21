/*
 * (#)Edit.tsx  0.1.0   10/20/2025
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

import React, {type JSX, useEffect, useState} from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Post } from "./types/Post.tsx";
/**
 * The edit component.
 *
 * @param   {string}    getUrl
 * @return  {JSX.Element}
 */
export default function Edit( { getUrl }: { getUrl: string }): JSX.Element {
    // Use array destructuring to get the searchParams object
    const [searchParams] = useSearchParams();
    const postId: string | null = searchParams.get('id');

    const emptyPost: Post = {
        id: 0,
        title: '',
        body: '',
        userId: 0
    }

    const [post, setPost] = useState<Post>(emptyPost);
    const [titleUpdated, setTitleUpdated] = useState<boolean>(false);
    const [bodyUpdated, setBodyUpdated] = useState<boolean>(false);

    useEffect((): void => {
        /**
         * Fetches the specified post from the server. The fetch will not
         * return a post newly added since it won't be actually saved to
         * the JSON placeholder data store.
         */
        const fetchPosts: () => Promise<void> = async (): Promise<void> => {
            try {
                const response: Response = await fetch(`${getUrl}/${postId}`);
                const data: Post = await response.json();

                setPost(data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchPosts().finally();
    }, [getUrl, postId]);

    /**
     * The change title handler.
     *
     * @param   {string}    title
     */
    const titleChanged: (title: string) => void = (title: string): void => {
        setPost({ ...post, title: title });
        setTitleUpdated(true);
    }

    /**
     * The change body handler.
     *
     * @param   {string}    body
     */
    const bodyChanged: (body: string) => void = (body: string): void => {
        setPost({ ...post, body: body });
        setBodyUpdated(true);
    }

    /**
     * The submit button handler.
     *
     * @param {React.FormEvent<HTMLFormElement} e
     */
    const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e: React.FormEvent<HTMLFormElement>): void => {
        if (titleUpdated && bodyUpdated) {
            putPost();
        } else if (titleUpdated || bodyUpdated) {
            patchPost();
        } else {
            console.log("The post was not updated");
        }

        e.preventDefault();
    };

    /**
     * Edit the post with a PATCH request.
     */
    const patchPost: () => void = (): void => {
        if (titleUpdated) {
            fetch(`${getUrl}/${post.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title: post.title,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }).then((response) => response.json())
                .then((json) => {
                    console.log("Used PATCH to update the post's title:");
                    console.log(json)
                });
        } else {
            fetch(`${getUrl}/${post.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    body: post.body,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }).then((response) => response.json())
                .then((json) => {
                    console.log("Used PATCH to update the post's body:");
                    console.log(json)
                });
        }
    }

    /**
     * Edit the post with a PUT request.
     */
    const putPost: () => void = (): void => {
        fetch(`${getUrl}/${post.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                id: post.id,
                title: post.title,
                body: post.body,
                userId: post.userId,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((response) => response.json())
          .then((json) => {
              console.log("Used PUT to replace the post:");
              console.log(json)
          });
    }

    return (
        <div>
            <h2>Edit - Post {postId}</h2>
            <div>
                <form className="form-container" onSubmit={ handleSubmit }>
                    <div className="form-group">
                        <label htmlFor="title" className="form-group-label">Title</label>
                        <input
                            type="text"
                            id="title"
                            className="form-input"
                            value={ post.title }
                            onChange={(e) => titleChanged(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="body" className="form-group-label">Body</label>
                        <textarea
                            id="body"
                            className="form-input"
                            value={ post.body }
                            onChange={(e) => bodyChanged(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Edit Post
                    </button>
                </form>
            </div>

            <Link to="/">Home</Link>
        </div>
    );
}
