package com.hobbyheaven.api.v1

import com.hobbyheaven.domain.User
import com.hobbyheaven.domain.UserRole
import com.hobbyheaven.repository.PatternRepository
import com.hobbyheaven.repository.UserRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/v1/users")
class UserController(
    private val userRepository: UserRepository,
    private val patternRepository: PatternRepository,
) {

    // ── /me ───────────────────────────────────────────────────────────────────

    /**
     * Returns the current user. When auth is disabled this returns a synthetic
     * admin user so the frontend always has a valid session to work with.
     */
    @GetMapping("/me")
    fun getMe(): ResponseEntity<UserResponse> {
        val user = resolveCurrentUser()
        return ResponseEntity.ok(UserResponse.from(user))
    }

    // ── Favourites ────────────────────────────────────────────────────────────

    /**
     * Returns the list of pattern IDs the current user has favourited.
     * The frontend only needs IDs to highlight the heart buttons.
     */
    @GetMapping("/me/favourites")
    fun getFavourites(): ResponseEntity<List<String>> {
        val user = resolveCurrentUser()
        val favourites = userRepository.findFavouritePatternIds(user.id)
        return ResponseEntity.ok(favourites.map { it.toString() })
    }

    @PostMapping("/me/favourites/{patternId}")
    fun addFavourite(@PathVariable patternId: UUID): ResponseEntity<Void> {
        val user    = resolveCurrentUser()
        val pattern = patternRepository.findById(patternId)
            .orElseThrow { NoSuchElementException("Pattern not found: $patternId") }
        userRepository.addFavourite(user.id, pattern.id)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/me/favourites/{patternId}")
    fun removeFavourite(@PathVariable patternId: UUID): ResponseEntity<Void> {
        val user = resolveCurrentUser()
        userRepository.removeFavourite(user.id, patternId)
        return ResponseEntity.noContent().build()
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * When auth is disabled, resolves (or lazily creates) the default admin user
     * so every endpoint has a real user record to work with.
     * When auth is enabled this will be replaced with the JWT principal lookup.
     */
    private fun resolveCurrentUser(): User {
        return userRepository.findByUsername("admin")
            ?: userRepository.save(
                User(
                    username = "admin",
                    email    = "admin@hobbyheaven.local",
                    role     = UserRole.ADMIN,
                )
            )
    }
}

// ─── DTO ──────────────────────────────────────────────────────────────────────

data class UserResponse(
    val id:        String,
    val username:  String,
    val email:     String,
    val role:      String,
    val createdAt: String,
) {
    companion object {
        fun from(u: User) = UserResponse(
            id        = u.id.toString(),
            username  = u.username,
            email     = u.email,
            role      = u.role.name,
            createdAt = u.createdAt.toString(),
        )
    }
}