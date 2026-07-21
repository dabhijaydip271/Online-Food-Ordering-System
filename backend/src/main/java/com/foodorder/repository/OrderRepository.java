package com.foodorder.repository;

import com.foodorder.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("""
        SELECT DISTINCT o
        FROM Order o
        LEFT JOIN FETCH o.orderItems
        ORDER BY o.createdAt DESC
    """)
    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("""
        SELECT DISTINCT o
        FROM Order o
        LEFT JOIN FETCH o.orderItems
        WHERE o.status = :status
        ORDER BY o.createdAt DESC
    """)
    List<Order> findByStatus(String status);
}