import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Post } from "../../../common/models/post";
import { getDescriptionParagraphs } from "../../../common/components/PostTile";
import './Moderation.css';
import { TeamSizeIcon } from "../../../common/components/TeamSizeIcon";
import { OptionsListDisplay } from "../../../common/components/OptionsListDisplay";
import { iiicon } from "../../../common/utils/iiicon";
import { skills } from "../../../common/models/skills";
import { useApiRequest } from "../../../api/apiRequest";
import { useState } from "react";
import { useAuth } from "../../../api/AuthContext";

export const Moderation = () => {
    return (
        <div className="c-admin-moderation">
            <h2>Moderation</h2>
            <h3>Reported Posts</h3>
            <ReportedPostList />
        </div>
    )
}

const ReportedPostList = () => {
    const req = useApiRequest();
    const { data, isLoading, isError } = useQuery({
        queryFn: async () => {
            const res: any = await req(`/admin/reports`);
            return res;
        },
        queryKey: ['reported'],
    });
    if(isLoading) {
        return <>loading ...</>;
    }
    if(isError) {
        return <>An error occured!</>;
    }
    if(!!data) {
        return (
            <div className="row flex scrollable">
                {data.map((post: Post) => <ReportedPost post={post} key={post.id} />)}
            </div>
        );
    }
}

const ReportedPost = ({ post }: { post: Post }) => {
    const auth = useAuth();
    const { mutate: dismiss } = useDismiss(post.id);
    const { mutate: deletePost } = useDelete(post.id);
    const { mutate: deleteAndBan } = useDeleteAndBan(post, auth?.token ?? '');
    const [ menuOpen, setMenuOpen ] = useState(false);
    return (
        <section className="c-post-tile c-reported-post">

            <div className="c-reported-post__count">
                Reported by <span className="emphazise">{post.reportCount}</span> users.
            </div>

            <hr />

            <header className="post-tile__header">
                <TeamSizeIcon size={post.size} />

                <span className="grow" style={{width: "calc(100% - 100px)"}}>
                    <h3 className="post-tile__header--title">
                        {post.author}
                    </h3>
                    <p className="post-tile__header--subtitle">
                        {post.size > 1 ? ` and ${post.size - 1} others are` : `is`} looking for members
                    </p>
                </span>
            </header>

            <div className="post-tile__body">
                <details>
                    <summary>Skill Information:</summary>
                        <OptionsListDisplay optionsToDisplay={post.skillsSought} totalOptions={skills} label={"Looking for:"} className={"[--skill-color:var(--skill-color-looking-for)] [--skill-text-color:var(--skill-color-looking-for-text)]"}/>
                        <OptionsListDisplay optionsToDisplay={post.skillsPossessed} totalOptions={skills} label={"Can do:"} className={"[--skill-color:var(--skill-color-possessed)] [--skill-text-color:var(--skill-color-possessed-text)]"}/>
                </details>
                {getDescriptionParagraphs(post).map((line, idx) => <p dir="auto" key={idx} className="mb-2">{line}</p>)}
            </div>

            <div className="post-tile__footer flex row gap-1">
                <button className="button-link-container primary" style={{ maxHeight: "3em" }} onClick={() => setMenuOpen(open => !open)}>
                    Take Action {iiicon(menuOpen ? "up-arrow" : "right-arrow", "var(--theme-background)")}
                </button>
                <div style={{position: "relative", width: 0}}>
                    <div className="actionMenu">
                        <div className={menuOpen ? "actionMenuContent open" : "actionMenuContent closed"}>
                            <span className="action" onClick={() => {
                                if(confirm('Delete Post?')) {
                                    deletePost()
                                }
                            }}>Delete</span>
                            <hr/>
                            <span className="action" onClick={() => {
                                if(confirm('Delete post and ban user?')) {
                                    deleteAndBan()
                                    }
                                }}>Delete&nbsp;and&nbsp;Ban</span>
                        </div>
                    </div>
                </div>
                <button className="button-link-container" style={{ maxHeight: "3em" }} onClick={() => dismiss()}>
                    Dismiss {iiicon("cross", "var(--theme-accent-dark)")}
                </button>
            </div>
        </section>
    );
}

const useDismiss = (id: string) => {
    const req = useApiRequest();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => {
            const res = req('/admin/reports/clear', {
                method: 'POST',
                body: { teamId: id },
            })
            return res;
        },
        mutationKey: ["reported"],
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["reported"]});
        }
    })
}

const useDelete = (id: string) => {
    const req = useApiRequest();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => {
            const res = req('/admin/post', {
                method: "DELETE",
                body: { postId: id },
            });
            return res;
        },
        mutationKey: ["reported"],
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["reported"]});
        }
    })
}

const useDeleteAndBan = (post: Post, adminId: string) => {
    const req = useApiRequest();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => {
            const deleteRes = req('/admin/post', {
                method: "DELETE",
                body: { postId: post.id },
            });
            const banRes = req('/admin/user/ban', {
                method: "POST",
                body: { discordId: post.authorId, adminId: adminId },
            }).then(msg => ({ msg: msg }));
            return Promise.all([deleteRes, banRes]);
        },
        mutationKey: ["reported"],
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["reported"]});
        }
    })
}
