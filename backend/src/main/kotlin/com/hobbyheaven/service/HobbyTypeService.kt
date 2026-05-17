package com.hobbyheaven.service

import com.hobbyheaven.api.v1.CreateCategoryRequest
import com.hobbyheaven.api.v1.CreateHobbyTypeRequest
import com.hobbyheaven.domain.Category
import com.hobbyheaven.domain.HobbyType
import com.hobbyheaven.repository.CategoryRepository
import com.hobbyheaven.repository.HobbyTypeRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
@Transactional(readOnly = true)
class HobbyTypeService(
    private val hobbyTypeRepository: HobbyTypeRepository,
    private val categoryRepository: CategoryRepository,
) {

    fun findAll(): List<HobbyType> = hobbyTypeRepository.findAll()

    fun findById(id: UUID): HobbyType =
        hobbyTypeRepository.findById(id).orElseThrow { NoSuchElementException("HobbyType not found: $id") }

    @Transactional
    fun create(request: CreateHobbyTypeRequest): HobbyType {
        if (hobbyTypeRepository.existsBySlug(request.slug)) {
            throw IllegalArgumentException("A hobby type with slug '${request.slug}' already exists")
        }
        return hobbyTypeRepository.save(
            HobbyType(
                name        = request.name,
                slug        = request.slug,
                description = request.description,
                icon        = request.icon,
            )
        )
    }

    fun findCategoriesFor(hobbyTypeId: UUID): List<Category> {
        findById(hobbyTypeId) // validates existence
        return categoryRepository.findByHobbyTypeId(hobbyTypeId)
    }

    @Transactional
    fun createCategory(request: CreateCategoryRequest): Category {
        val hobbyType = findById(request.hobbyTypeId)
        return categoryRepository.save(
            Category(
                name      = request.name,
                slug      = request.slug,
                hobbyType = hobbyType,
            )
        )
    }
}
