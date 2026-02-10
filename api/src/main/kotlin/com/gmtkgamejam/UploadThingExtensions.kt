package com.gmtkgamejam

import dev.siri.uploadthing.dto.responses.UploadThingFileResponse

/**
 * Returns the file URL if the UploadThingFileResponse is not null, otherwise returns the provided defaultUrl.
 */
fun UploadThingFileResponse?.getImageUrlOrDefault(defaultFile: String): String =
    this?.let { "https://faks48l4an.ufs.sh/f/${it.key}" } ?: "https://findyourjam.team/${defaultFile}"
