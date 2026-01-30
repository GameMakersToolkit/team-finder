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
import java.time.LocalDateTime

private object UploaderFileCache {
    @Volatile var files: List<UploadThingFileResponse>? = null
    private val lock = Any()

    fun getCachedFiles(uploader: UploadThing): List<UploadThingFileResponse> {
        if (files == null) {
            synchronized(lock) {
                val fetched = uploader.listFiles().get().files
                files = fetched
            }
        }
        return files ?: emptyList()
    }

    fun refresh(uploader: UploadThing) {
        synchronized(lock) {
            val fetched = uploader.listFiles().get().files
            files = fetched
        }
    }
}

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

                val files = UploaderFileCache.getCachedFiles(uploader)

                val bgImage: UploadThingFileResponse? = files.firstOrNull { file -> file.name.startsWith("${jam.jamId}:bg-image") }
                jam.bgImageUrl = if (bgImage != null) "https://faks48l4an.ufs.sh/f/${bgImage.key}" else "https://findyourjam.team/background-image.png"

                val logoLarge: UploadThingFileResponse? = files.firstOrNull { file -> file.name.startsWith("${jam.jamId}:logo-large") }
                jam.logoLargeUrl = if (logoLarge != null) "https://faks48l4an.ufs.sh/f/${logoLarge.key}" else "https://findyourjam.team/background-image.png"

                val logoStacked: UploadThingFileResponse? = files.firstOrNull { file -> file.name.startsWith("${jam.jamId}:logo-stacked") }
                jam.logoStackedUrl = if (logoStacked != null) "https://faks48l4an.ufs.sh/f/${logoStacked.key}" else "https://findyourjam.team/background-image.png"

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

                    jam.start = update.start ?: jam.start
                    jam.end = update.end ?: jam.end
                    jam.bgImageUrl = update.bgImageUrl ?: jam.bgImageUrl
                    jam.logoLargeUrl = update.logoLargeUrl ?: jam.logoLargeUrl
                    jam.logoStackedUrl = update.logoStackedUrl ?: jam.logoStackedUrl
                    jam.styles = if (!update.styles.isNullOrEmpty()) update.styles else jam.styles

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

                            // Exit early if extension is not valid image type
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

                            try {
                                // Delete file if present; filenames are not unique
                                try {
                                    uploader.deleteFile(filename).get()
                                    println("Deleting existing file $filename (if I can find it)")
                                } catch (e: Exception) {
                                    // Log but ignore, as file may not exist
                                    println("Delete file warning: ${e.message}")
                                }

                                // Upload the new file
                                val uploadedFile = uploader.uploadFile(file).get()
                                println("FILE UPLOADED: $uploadedFile")

                                // Clean up file reference on disk
                                file.delete()

                                UploaderFileCache.refresh(uploader)
                                call.respondJSON(text = "File uploaded at ${LocalDateTime.now()}", HttpStatusCode.OK)
                            } catch (e: Exception) {
                                println("Error uploading file: ${e.message}")
                                file.delete()
                                call.respondJSON("Error uploading file: ${e.message}", HttpStatusCode.InternalServerError)
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
