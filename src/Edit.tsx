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
 * @return  {JSX.Element}
 */
export default function Edit(): JSX.Element {
    // Use array destructuring to get the searchParams object
    const [searchParams] = useSearchParams();
    const postId: string | null = searchParams.get('id');

    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");

    useEffect((): void => {
        /**
         * Fetches the specified post from the server. The fetch will not
         * return a post newly added since it won't be actually saved to
         * the JSON placeholder data store.
         */
        const fetchPosts: () => Promise<void> = async (): Promise<void> => {
            try {
                const response: Response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
                const post: Post = await response.json();

                setTitle(post.title);
                setBody(post.body);
            } catch (error) {
                console.log(error);
            }
        }

        fetchPosts().finally();
    }, [postId]);

    const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
    };

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
                        Edit Post
                    </button>
                </form>
            </div>

            <Link to="/">Home</Link>
        </div>
    );
}
