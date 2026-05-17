package com.hobbyheaven.domain

import jakarta.persistence.*
import java.time.Instant
import java.util.*

enum class ProgressStatus { WANT_TO_MAKE, IN_PROGRESS, COMPLETED }

@Entity
@Table(
    name = "user_progress",
    uniqueConstraints = [UniqueConstraint(columnNames = ["user_id", "pattern_id"])]
)
class UserProgress(

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pattern_id", nullable = false)
    var pattern: Pattern,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    var status: ProgressStatus = ProgressStatus.WANT_TO_MAKE,

    @Column(name = "current_step", nullable = false)
    var currentStep: Int = 0,

    @Column(columnDefinition = "TEXT")
    var notes: String? = null,

    @Column(name = "started_at")
    var startedAt: Instant? = null,

    @Column(name = "completed_at")
    var completedAt: Instant? = null,

) {
    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    val id: UUID = UUID.randomUUID()
}
