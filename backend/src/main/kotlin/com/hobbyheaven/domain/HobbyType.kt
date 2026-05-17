package com.hobbyheaven.domain

import jakarta.persistence.*
import java.time.Instant
import java.util.*

@Entity
@Table(name = "hobby_types")
class HobbyType(

    @Column(nullable = false, unique = true, length = 64)
    var name: String,

    @Column(nullable = false, unique = true, length = 64)
    var slug: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @Column(length = 64)
    var icon: String? = null,

) {
    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    val id: UUID = UUID.randomUUID()

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()

    @OneToMany(mappedBy = "hobbyType", cascade = [CascadeType.ALL], orphanRemoval = true)
    val categories: MutableList<Category> = mutableListOf()
}
