import React from "react";
import {Post} from "../../../common/models/post.ts";
import {useAuth} from "../../../api/AuthContext.tsx";
import {useReportPostMutation} from "../../../api/post.ts";
import {toast} from "react-hot-toast";
import {login} from "../../../api/login.ts";
import { safeGetString, safeParseJsonArray, safeSetString } from "../../../common/utils/storageUtils.ts";

export const ReportButton: React.FC<{ post: Post }> = ({
    post
}) => {
    const auth = useAuth();
    const reportPostMutation = useReportPostMutation();

    const onClick = (e: { preventDefault(): void }) => {
        e.preventDefault();

        reportPostMutation.mutate({
            id: post.id,
        }, {
            onSuccess: () => {
                toast("Thanks for reporting");
                const existing = safeParseJsonArray(safeGetString("reported"));
                const deduplicated = Array.from(new Set([post.id, ...existing]));
                safeSetString("reported", JSON.stringify(deduplicated));
            }
        });
    };

    const isReported: () => boolean = () => {
        const data = safeParseJsonArray(safeGetString("reported"));
        return data.includes(post.id)
    }

    if (!auth) {
        return (
            <div className="">
                <a className="font-bold underline cursor-pointer" onClick={login}><span>&#9873;</span> Log in to report posts for spam or abuse</a>
            </div>
        )
    }

    return (
        <>
            {auth &&
                <div className="">
                    {!isReported() &&
                        <a className="font-bold underline cursor-pointer" href="#report" onClick={onClick}><span>&#9873;</span> Report post</a>
                    }
                    {isReported() &&
                        <span>Thanks for reporting!</span>
                    }
                </div>
            }
        </>
    )
}
