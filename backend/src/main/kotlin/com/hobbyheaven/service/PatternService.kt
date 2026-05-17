package com.hobbyheaven.service

import com.hobbyheaven.api.v1.*
import com.hobbyheaven.domain.*
import com.hobbyheaven.repository.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
@Transactional(readOnly = true)
class PatternService(
    private val patternRepository: PatternRepository,
    private val hobbyTypeRepository: HobbyTypeRepository,
    private val categoryRepository: CategoryRepository,
    private val tagRepository: TagRepository,
    private val materialRepository: MaterialRepository,
) {

    fun findAll(
        hobbyTypeId: UUID?,
        difficulty: Difficulty?,
        categoryId: UUID?,
        tagSlug: String?,
        search: String?,
        pageable: Pageable,
    ): Page<Pattern> = when {
        categoryId != null -> patternRepository.findByCategoryId(categoryId, pageable)
        tagSlug != null    -> patternRepository.findByTagSlug(tagSlug, pageable)
        else               -> patternRepository.findWithFilters(hobbyTypeId, difficulty, search, pageable)
    }

    fun findById(id: UUID): Pattern =
        patternRepository.findById(id).orElseThrow { NoSuchElementException("Pattern not found: $id") }

    @Transactional
    fun create(request: CreatePatternRequest, createdBy: UUID? = null): Pattern {
        val hobbyType = hobbyTypeRepository.findById(request.hobbyTypeId)
            .orElseThrow { NoSuchElementException("HobbyType not found: ${request.hobbyTypeId}") }

        val pattern = Pattern(
            title        = request.title,
            description  = request.description,
            difficulty   = request.difficulty,
            author       = request.author,
            sourceUrl    = request.sourceUrl,
            hobbyType    = hobbyType,
            metadata     = request.metadata.toMutableMap(),
            instructions = request.instructions.toMutableList(),
            createdBy    = createdBy,
        )

        // Categories
        val categories = categoryRepository.findAllById(request.categoryIds)
        pattern.categories.addAll(categories)

        // Tags — create if they don't exist
        val tags = resolveOrCreateTags(request.tagNames)
        pattern.tags.addAll(tags)

        val saved = patternRepository.save(pattern)

        // Materials
        request.materials.forEachIndexed { index, req ->
            saved.materials.add(Material(
                pattern   = saved,
                name      = req.name,
                quantity  = req.quantity,
                unit      = req.unit,
                notes     = req.notes,
                sortOrder = req.sortOrder.takeIf { it != 0 } ?: index,
            ))
        }

        return patternRepository.save(saved)
    }

    @Transactional
    fun update(id: UUID, request: UpdatePatternRequest): Pattern {
        val pattern = findById(id)

        request.title?.let       { pattern.title = it }
        request.description?.let { pattern.description = it }
        request.difficulty?.let  { pattern.difficulty = it }
        request.author?.let      { pattern.author = it }
        request.sourceUrl?.let   { pattern.sourceUrl = it }
        request.metadata?.let    { pattern.metadata = it.toMutableMap() }
        request.instructions?.let { pattern.instructions = it.toMutableList() }

        request.hobbyTypeId?.let { hobbyTypeId ->
            pattern.hobbyType = hobbyTypeRepository.findById(hobbyTypeId)
                .orElseThrow { NoSuchElementException("HobbyType not found: $hobbyTypeId") }
        }

        request.categoryIds?.let { ids ->
            pattern.categories.clear()
            pattern.categories.addAll(categoryRepository.findAllById(ids))
        }

        request.tagNames?.let { names ->
            pattern.tags.clear()
            pattern.tags.addAll(resolveOrCreateTags(names))
        }

        request.materials?.let { materialRequests ->
            pattern.materials.clear()
            materialRequests.forEachIndexed { index, req ->
                pattern.materials.add(Material(
                    pattern   = pattern,
                    name      = req.name,
                    quantity  = req.quantity,
                    unit      = req.unit,
                    notes     = req.notes,
                    sortOrder = req.sortOrder.takeIf { it != 0 } ?: index,
                ))
            }
        }

        return patternRepository.save(pattern)
    }

    @Transactional
    fun delete(id: UUID) {
        val pattern = findById(id)
        patternRepository.delete(pattern)
    }

    @Transactional
    fun updateCoverImage(id: UUID, imagePath: String): Pattern {
        val pattern = findById(id)
        pattern.coverImagePath = imagePath
        return patternRepository.save(pattern)
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private fun resolveOrCreateTags(names: Set<String>): List<Tag> {
        if (names.isEmpty()) return emptyList()

        val existing = tagRepository.findByNameIn(names.toList()).associateBy { it.name }
        val newTags = names
            .filter { it !in existing }
            .map { Tag(name = it, slug = it.lowercase().replace(" ", "-")) }

        if (newTags.isNotEmpty()) tagRepository.saveAll(newTags)
        return existing.values + newTags
    }
}
