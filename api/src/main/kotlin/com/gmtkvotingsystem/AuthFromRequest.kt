package com.gmtkvotingsystem

import com.auth0.jwt.JWT
import com.gmtkvotingsystem.models.auth.AuthTokenSet
import com.gmtkvotingsystem.services.AuthService
import io.ktor.server.application.*
import io.ktor.server.request.*

public fun getAuthFromCall(
    authService: AuthService,
    call: ApplicationCall,
): AuthTokenSet? {
    // Set isFavourite on posts for this user if they're logged in
    return call.request
        .header("Authorization")
        ?.substring(7)
        ?.let { JWT.decode(it) }
        ?.getClaim("id")
        ?.asString()
        ?.let { authService.getTokenSet(it) }
}
