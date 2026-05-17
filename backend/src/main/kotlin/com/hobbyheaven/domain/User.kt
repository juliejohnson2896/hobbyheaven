package com.hobbyheaven.domain

import jakarta.persistence.*
import java.time.Instant
import java.util.*

enum class UserRole { ADMIN, USER }

@Entity
@Table(name = "users")
class User(

    @Column(nullable = false, unique = true, length = 64)
    var username: String,

    @Column(nullable = false, unique = true)
    var email: String,

    @Column(name = "password_hash")
    var passwordHash: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    var role: UserRole = UserRole.USER,

    @Column(name = "oidc_subject", unique = true)
    var oidcSubject: String? = null,

) {
    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    val id: UUID = UUID.randomUUID()

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()
}
