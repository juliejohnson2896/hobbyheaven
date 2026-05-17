package com.hobbyheaven.api.v1

import com.hobbyheaven.repository.TagRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/tags")
class TagController(private val tagRepository: TagRepository) {

    @GetMapping
    fun list(): ResponseEntity<List<TagResponse>> =
        ResponseEntity.ok(tagRepository.findAll().map { TagResponse.from(it) })
}
