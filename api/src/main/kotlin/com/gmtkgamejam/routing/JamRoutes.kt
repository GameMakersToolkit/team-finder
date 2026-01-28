package com.gmtkgamejam.routing

import com.gmtkgamejam.Config
import com.gmtkgamejam.models.jams.Jam
import com.gmtkgamejam.models.jams.JamUpdateDto
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.JamService
import dev.siri.uploadthing.UploadThing
import dev.siri.uploadthing.dto.responses.UploadThingFileResponse
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.cio.*
import io.ktor.utils.io.*
import org.koin.ktor.ext.inject
import java.io.File

fun Application.configureJamRouting() {
    val config: Config by inject()
    val jamService: JamService by inject()
    val uploader = UploadThing(config.getString("uploadthingKey"))

    routing {
        route("/jams") {
            get {
                return@get call.respond(jamService.getJams())
            }
        }

        route("/jams/{jamId}") {
            get {
                val jamId = call.parameters["jamId"]
                val jams = jamService.getJams()
                val jam: Jam = jams.find { jam -> jam.jamId == jamId }
                    ?: return@get call.respondJSON("No jam matched ID of $jamId", HttpStatusCode.NotFound)


                // TODO: Cache this result
                val bgImage: UploadThingFileResponse? = uploader.listFiles().get().files.firstOrNull { file -> file.name.startsWith("${jam.jamId}:bg-image") }
                jam.bgImageUrl = if (bgImage != null) "https://faks48l4an.ufs.sh/f/${bgImage.key}" else "https://findyourjam.team/background-image.png"
                return@get call.respond(jam)
            }

            authenticate("auth-jwt-admin") {
                put {
                    val jamId = call.parameters["jamId"] ?: return@put call.respondJSON("Missing jamId", HttpStatusCode.BadRequest)
                    val jam = jamService.getJam(jamId)
                    if (jam == null) {
                        return@put call.respondJSON("No jam matched ID of $jamId", HttpStatusCode.NotFound)
                    }

                    val update = call.receive<JamUpdateDto>()

                    // TODO: Rest of jam fields
                    if (update.styles != null) {
                        jam.styles = update.styles.ifEmpty { jam.styles }
                    }

                    val updatedJam = jamService.updateJam(jam)
                    return@put call.respond(updatedJam)
                }

                post("/image") {
                    val jamId = call.parameters["jamId"] ?: return@post call.respondJSON("Missing jamId", HttpStatusCode.BadRequest)
                    val jam = jamService.getJam(jamId)
                    if (jam == null) {
                        return@post call.respondJSON("No jam matched ID of $jamId", HttpStatusCode.NotFound)
                    }

                    val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 3) // 3MB limit

                    multipartData.forEachPart { part ->
                        if (part is PartData.FileItem) {
                            val fileCtx = call.queryParameters["ctx"] ?: "unknown"
                            val extension = File(part.originalFileName ?: "").extension

                            // TODO: Exit early if extension is not valid image type
                            if (!validImageExtensions.contains(extension)) {
                                call.respondJSON("Error uploading file - invalid file type", HttpStatusCode.BadRequest)
                                part.dispose()
                                return@forEachPart
                            }

                            val filename = "${jam.jamId}:$fileCtx.$extension"
                            val file = File(filename)
                            try {
                                part.provider().copyTo(file.writeChannel())
                            } finally {
                                part.dispose()
                            }

                            // TODO: Response handling, use whenComplete to manage success/failure
                            var didError: Boolean = false
                            uploader.deleteFile(filename)
                                .whenComplete {
                                    _, _ -> run {
                                        uploader.uploadFile(file)
                                            .whenComplete { file, thrown ->
                                                run {
                                                    println("FILE UPLOADED: $file")

                                                    if (thrown != null) {
                                                        didError = true
                                                        println("Error uploading file: ${thrown.message}")
                                                    }
                                                }
                                            }
                                    }
                                }


                            // TODO: This obviously doesn't work because the above is async
                            if (didError) {
                                call.respondJSON("Error uploading file", HttpStatusCode.InternalServerError)
                            } else {
                                call.respond(HttpStatusCode.OK)
                            }
                        }
                    }
                }
            }
        }
    }
}

val validImageExtensions = listOf(
    "ase",
    "art",
    "bmp",
    "blp",
    "cd5",
    "cit",
    "cpt",
    "cr2",
    "cut",
    "dds",
    "dib",
    "djvu",
    "egt",
    "exif",
    "gif",
    "gpl",
    "grf",
    "icns",
    "ico",
    "iff",
    "jng",
    "jpeg",
    "jpg",
    "jfif",
    "jp2",
    "jps",
    "lbm",
    "max",
    "miff",
    "mng",
    "msp",
    "nef",
    "nitf",
    "ota",
    "pbm",
    "pc1",
    "pc2",
    "pc3",
    "pcf",
    "pcx",
    "pdn",
    "pgm",
    "PI1",
    "PI2",
    "PI3",
    "pict",
    "pct",
    "pnm",
    "pns",
    "ppm",
    "psb",
    "psd",
    "pdd",
    "psp",
    "px",
    "pxm",
    "pxr",
    "qfx",
    "raw",
    "rle",
    "sct",
    "sgi",
    "rgb",
    "int",
    "bw",
    "tga",
    "tiff",
    "tif",
    "vtf",
    "xbm",
    "xcf",
    "xpm",
    "3dv",
    "amf",
    "ai",
    "awg",
    "cgm",
    "cdr",
    "cmx",
    "dxf",
    "e2d",
    "egt",
    "eps",
    "fs",
    "gbr",
    "odg",
    "svg",
    "stl",
    "vrml",
    "x3d",
    "sxd",
    "v2d",
    "vnd",
    "wmf",
    "emf",
    "art",
    "xar",
    "png",
    "webp",
    "jxr",
    "hdp",
    "wdp",
    "cur",
    "ecw",
    "iff",
    "lbm",
    "liff",
    "nrrd",
    "pam",
    "pcx",
    "pgf",
    "sgi",
    "rgb",
    "rgba",
    "bw",
    "int",
    "inta",
    "sid",
    "ras",
    "sun",
    "tga",
    "heic",
    "heif"
)
