package com.hobbyheaven.domain

import jakarta.persistence.*
import java.math.BigDecimal
import java.util.*

@Entity
@Table(name = "materials")
class Material(

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pattern_id", nullable = false)
    var pattern: Pattern,

    @Column(nullable = false, length = 128)
    var name: String,

    @Column(precision = 10, scale = 2)
    var quantity: BigDecimal? = null,

    @Column(length = 32)
    var unit: String? = null,

    @Column(columnDefinition = "TEXT")
    var notes: String? = null,

    @Column(name = "sort_order", nullable = false)
    var sortOrder: Int = 0,

) {
    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    val id: UUID = UUID.randomUUID()
}
