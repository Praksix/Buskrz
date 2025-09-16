package com.praksix.buskrz.service;
import java.util.Collection;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.praksix.buskrz.model.User;

@Service
public interface UserService {
    

    public void createUser(User user);
    public void updateUser(User user);

    public Collection<User> getUsers();

    public void deleteUser(String id);

    public void deleteAllUsers();

    public Optional<User> getUserById(String id);



}
