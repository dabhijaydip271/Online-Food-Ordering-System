package com.foodorder.service;

import com.foodorder.model.Order;
import com.foodorder.model.OrderItem;
import com.foodorder.repository.OrderItemRepository;
import com.foodorder.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    // CREATE
    public OrderItem createOrderItem(OrderItem orderItem) {

        Long orderId = orderItem.getOrder().getId();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        orderItem.setOrder(order);

        return orderItemRepository.save(orderItem);
    }

    // GET ALL
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    // GET BY ID
    public Optional<OrderItem> getOrderItemById(Long id) {
        return orderItemRepository.findById(id);
    }

    // GET BY ORDER ID
    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    // UPDATE
    public OrderItem updateOrderItem(Long id, OrderItem updatedItem) {

        OrderItem item = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order Item not found"));

        item.setMenuItemId(updatedItem.getMenuItemId());
        item.setMenuItemName(updatedItem.getMenuItemName());
        item.setQuantity(updatedItem.getQuantity());
        item.setPrice(updatedItem.getPrice());

        return orderItemRepository.save(item);
    }

    // PATCH
    public OrderItem patchOrderItem(Long id, Map<String, Object> updates) {

        OrderItem item = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order Item not found"));

        if (updates.containsKey("menuItemName")) {
            item.setMenuItemName((String) updates.get("menuItemName"));
        }

        if (updates.containsKey("quantity")) {
            item.setQuantity((Integer) updates.get("quantity"));
        }

        if (updates.containsKey("price")) {
            item.setPrice(new java.math.BigDecimal(updates.get("price").toString()));
        }

        return orderItemRepository.save(item);
    }

    // DELETE
    public void deleteOrderItem(Long id) {

        OrderItem item = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order Item not found"));

        orderItemRepository.delete(item);
    }
}