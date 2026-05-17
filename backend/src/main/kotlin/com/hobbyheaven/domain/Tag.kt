package com.hobbyheaven.domain

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "tags")
class Tag(

    @Column(nullable = false, unique = true, length = 64)
    var name: String,

    @Column(nullable = false, unique = true, length = 64)
    var slug: String,

) {
    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    val id: UUID = UUID.randomUUID()
}
