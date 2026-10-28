import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "../../../api/apiRequest.ts";
import { getJamId } from "../../../common/utils/getJamId.ts";
import { JamInsights } from "./JamInsights.tsx";

export const Overview: React.FC = () => {
  const navigate = useNavigate();
  const jamId = getJamId();
  const req = useApiRequest();
  const queryClient = useQueryClient();

  const { mutate: deleteJam } = useMutation({
    mutationFn: async () => {
      return req(`/${jamId}/admin/jam`, {
        method: "DELETE",
      });
    },
    mutationKey: ["jam", jamId, "delete"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jam", jamId] });
      queryClient.invalidateQueries({ queryKey: ["jams"] });
      navigate("/");
    },
  });

  const handleDeleteJam = () => {
    if (!window.confirm("Delete this jam? This will hide it from all users and keep the record in the database for review.")) {
      return;
    }

    deleteJam();
  };

  return (
    <section>
      <h2>Overview</h2>
      <p className="mb-4">Quick health and moderation stats for this jam.</p>
      <JamInsights />
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="button-link-container bg-red-700 hover:bg-red-600 border-red-500 text-white"
          onClick={handleDeleteJam}
        >
          Delete Jam
        </button>
      </div>
    </section>
  );
};
