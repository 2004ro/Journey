package com.travel.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class RootController implements ErrorController {

    // Redirect root to the cities API so visiting the backend base URL is useful
    @GetMapping("/")
    public RedirectView root() {
        return new RedirectView("/api/cities");
    }

    // Provide a simple error description for unmapped /error path
    @RequestMapping("/error")
    @ResponseBody
    public String error() {
        return "Resource not found. Use /api/cities or open the frontend at http://localhost";
    }
}
