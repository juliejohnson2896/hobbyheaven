package com.hobbyheaven.api.v1

import com.hobbyheaven.service.HobbyTypeService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/v1/hobby-types")
class HobbyTypeController(private val hobbyTypeService: HobbyTypeService) {

    @GetMapping
    fun list(): ResponseEntity<List<HobbyTypeResponse>> =
        ResponseEntity.ok(hobbyTypeService.findAll().map { HobbyTypeResponse.from(it) })

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): ResponseEntity<HobbyTypeResponse> =
        ResponseEntity.ok(HobbyTypeResponse.from(hobbyTypeService.findById(id)))

    @PostMapping
    fun create(@Valid @RequestBody request: CreateHobbyTypeRequest): ResponseEntity<HobbyTypeResponse> {
        val hobbyType = hobbyTypeService.create(request)
        return ResponseEntity.status(201).body(HobbyTypeResponse.from(hobbyType))
    }

    @GetMapping("/{id}/categories")
    fun listCategories(@PathVariable id: UUID): ResponseEntity<List<CategoryResponse>> =
        ResponseEntity.ok(hobbyTypeService.findCategoriesFor(id).map { CategoryResponse.from(it) })
}

@RestController
@RequestMapping("/api/v1/categories")
class CategoryController(private val hobbyTypeService: HobbyTypeService) {

    @PostMapping
    fun create(@Valid @RequestBody request: CreateCategoryRequest): ResponseEntity<CategoryResponse> {
        val category = hobbyTypeService.createCategory(request)
        return ResponseEntity.status(201).body(CategoryResponse.from(category))
    }
}
