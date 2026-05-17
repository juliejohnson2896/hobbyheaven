package com.hobbyheaven.domain

import jakarta.persistence.*
import java.time.Instant
import java.util.*

@Entity
@Table(
    name = "categories",
    uniqueConstraints = [UniqueConstraint(columnNames = ["slug", "hobby_type_id"])]
)
class Category(

    @Column(nullable = false, length = 64)
    var name: String,

    @Column(nullable = false, length = 64)
    var slug: String,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hobby_type_id", nullable = false)
    var hobbyType: HobbyType,

) {
    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    val id: UUID = UUID.randomUUID()

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()
}
