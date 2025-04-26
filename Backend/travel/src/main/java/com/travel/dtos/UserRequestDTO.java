package com.travel.dtos;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    @Pattern(regexp = "^[A-Z][a-zA-Z ]*$", message = "Name must start with an uppercase letter and contain only letters and spaces")
    private String name;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(
            regexp = "^(?=.*\\d)[A-Z][a-zA-Z\\d]{5,}$",
            message = "Password must start with an uppercase letter, be at least 6 characters, and contain at least one number"
    )
    private String password;
    private boolean admin;
}
