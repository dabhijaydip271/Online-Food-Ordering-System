package com.foodorder.service;

import com.foodorder.dto.OrderRequest;
import com.foodorder.model.Order;
import com.foodorder.model.OrderItem;
import com.foodorder.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // CREATE
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerAddress(request.getCustomerAddress());
        order.setStatus("PENDING");

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItemId(itemReq.getMenuItemId());
            orderItem.setMenuItemName(itemReq.getMenuItemName());
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(itemReq.getPrice());
            order.getOrderItems().add(orderItem);

            totalAmount = totalAmount.add(
                    itemReq.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()))
            );
        }

        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }

    // READ - All (newest first)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    // READ - By ID
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // READ - By Status
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    // UPDATE - Status
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // DELETE
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        orderRepository.delete(order);
    }
}
