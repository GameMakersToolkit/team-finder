
import com.gmtkgamejam.models.posts.Availability
import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.models.posts.Skills
import com.gmtkgamejam.models.posts.Tools
import io.ktor.http.*
import org.bson.conversions.Bson
import org.litote.kmongo.*
import kotlin.reflect.full.memberProperties

inline fun <reified A : Enum<A>> enumSetFromInput(commaSeparatedString: String) : Set<A> {
    return commaSeparatedString.split(',')
        .filter(String::isNotBlank)
        .map { enumValueOf<A>(it) }
        .toSet()
}

/**
 * Parameter block for a search request made by a user
 */
data class SearchParams(
    val sortBy: String,
    val sortDir: String,
    val jamId: String?,
    val description: String?,
    val skillsPossessed: Set<Skills>?,
    val skillsSought: Set<Skills>?,
    val tools: Set<Tools>?,
    val languages: Set<String>?,
    val availability: Set<Availability>?,
    val timezones: Set<Int>?,
) {
    constructor(params: Parameters) : this(
        sortBy = params["sortBy"] ?: "createdAt",
        sortDir = params["sortDir"] ?: "desc",
        jamId = params["jamId"],
        description = params["description"],
        skillsPossessed = params["skillsPossessed"]?.let { enumSetFromInput<Skills>(it) },
        skillsSought = params["skillsSought"]?.let { enumSetFromInput<Skills>(it) },
        tools = params["tools"]?.let { enumSetFromInput<Tools>(it) },
        languages = params["languages"]?.split(',')?.filter(String::isNotBlank)?.toSet(),
        availability = params["availability"]?.let { enumSetFromInput<Availability>(it) },
        timezones = generateTimezones(params)
    )


    companion object {
        fun generateTimezones(params: Parameters): Set<Int>? {
            if (params["timezoneStart"] == null || params["timezoneEnd"] == null) {
                return null
            }

            val timezoneStart = params["timezoneStart"]!!.toInt()
            val timezoneEnd = params["timezoneEnd"]!!.toInt()
            val timezones: MutableSet<Int> = mutableSetOf()
            if (timezoneStart == timezoneEnd) {
                timezones.add(timezoneStart)
            } else if (timezoneStart < timezoneEnd) {
                // UTC-2 -> UTC+2 should be: [-2, -1, 0, 1, 2]
                timezones.addAll((timezoneStart..timezoneEnd))
            } else {
                // UTC+9 -> UTC-9 should be: [9, 10, 11, 12, -12, -11, -10, -9]
                timezones.addAll((timezoneStart..12))
                timezones.addAll((-12..timezoneEnd))
            }

            return timezones
        }
    }

    fun getSort(): Bson {
        val sortByField = PostItem::class.memberProperties.first { prop -> prop.name == sortBy }
        return when (sortDir) {
            "asc" -> ascending(sortByField)
            "desc" -> descending(sortByField)
            else -> descending(sortByField)
        }
    }

    fun toBson(): Bson {
        val filters = mutableListOf<Bson>(PostItem::deletedAt eq null)

        jamId?.let { filters.add(PostItem::jamId eq it) }
        description?.split(',')
            ?.filter(String::isNotBlank)
            ?.map { it.trim() }
            ?.forEach { filters.add(PostItem::description regex it.toRegex(RegexOption.IGNORE_CASE)) }

        skillsPossessed?.let {
            if (it.isNotEmpty()) {
                // Default to AND logic for skillsPossessed
                filters.add(and(it.map { skill -> PostItem::skillsPossessed contains skill }))
            }
        }
        skillsSought?.let {
            if (it.isNotEmpty()) {
                // Default to AND logic for skillsSought
                filters.add(and(it.map { skill -> PostItem::skillsSought contains skill }))
            }
        }
        tools?.let {
            if (it.isNotEmpty()) {
                filters.addAll(it.map { tool -> PostItem::preferredTools contains tool })
            }
        }
        languages?.let {
            if (it.isNotEmpty()) {
                filters.add(or(it.map { lang -> PostItem::languages contains lang }))
            }
        }
        availability?.let {
            if (it.isNotEmpty()) {
                filters.add(or(it.map { avail -> PostItem::availability eq avail }))
            }
        }
        timezones?.let {
            if (it.isNotEmpty()) {
                filters.add(or(it.map { tz -> PostItem::timezoneOffsets contains tz }))
            }
        }
        return and(filters)
    }
}
