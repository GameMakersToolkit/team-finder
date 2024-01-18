import React from "react";
import {Post} from "../../../common/models/post.ts";
import {useAuth} from "../../../api/AuthContext.tsx";
import {useReportBrokenDMsPostMutation} from "../../../api/post.ts";
import {toast} from "react-hot-toast";

export const ReportBrokenDMsButton: React.FC<{ post: Post }> = ({
    post
}) => {
    const auth = useAuth();
    const reportMutation = useReportBrokenDMsPostMutation();

    const onClick = (e: { preventDefault(): void }) => {
        e.preventDefault();

        reportMutation.mutate({
            id: post.id,
        }, {
            onSuccess: () => {
                toast("Thanks for letting us know!");
                let d = [post.id];
                const value = localStorage.getItem("reported_dms");
                if (value != null && value != "") d = d.concat(JSON.parse(value))
                localStorage.setItem("reported_dms", JSON.stringify(d));
            }
        });
    };

    const isReported: () => boolean = () => {
        const value = localStorage.getItem("reported_dms");
        if (value == null || value == "") return false;
        const data: Array<string> = JSON.parse(value);
        return data.includes(post.id)
    }

    return (
        <>
            {auth &&
                <div className="">
                    {!isReported() &&
                        <a className="hover:underline decoration-stone-50" href="#report" onClick={onClick}>Discord button not working?</a>
                    }
                    {isReported() &&
                        <span>Thanks, we&apos;ll look into this.</span>
                    }
                </div>
            }
        </>
    )
}

