import React from "react";
import {Post} from "../../../common/models/post.ts";
import {useAuth} from "../../../api/AuthContext.tsx";
import {useReportPostMutation} from "../../../api/post.ts";
import {toast} from "react-hot-toast";
import {login} from "../../../api/login.ts";

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
                let d = [post.id];
                const value = localStorage.getItem("reported");
                if (value != null && value != "") d = d.concat(JSON.parse(value))
                localStorage.setItem("reported", JSON.stringify(d));
            }
        });
    };

    const isReported: () => boolean = () => {
        const value = localStorage.getItem("reported");
        if (value == null || value == "") return false;
        const data: Array<string> = JSON.parse(value);
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
