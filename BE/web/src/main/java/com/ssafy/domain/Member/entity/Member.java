package com.ssafy.domain.Member.entity;

import com.ssafy.domain.Member.dto.request.SignUpRequest;
import com.ssafy.domain.Member.dto.request.UpdateMemberRequest;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Member implements UserDetails {
    @Id
    @Column(name = "id", updatable = false, unique = true, nullable = false)
    private String id;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "tee_box")
    @Enumerated(EnumType.STRING)
    private TeeBox teeBox;

    @Column(name = "top_score")
    private int topScore;

    @Column(name = "average_score")
    private int averageScore;

    @Column(name = "level")
    private String level;

    @Column(name = "image")
    private String image;

    @Column(name = "introduction", columnDefinition = "TEXT")
    private String introduction;

    @ElementCollection(fetch = FetchType.EAGER)
    @Builder.Default // roles table 자동 생성
    @Enumerated(EnumType.STRING)
    private List<Role> roles = new ArrayList<>(List.of(Role.ROLE_USER));

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(Role::name)
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    public static Member from(SignUpRequest request, PasswordEncoder encoder){
        return Member.builder()
                .id(request.memberId())
                .password(encoder.encode(request.password()))
                .nickname(request.nickname())
                .teeBox(request.teeBox())
                .topScore(request.topScore())
                .averageScore(request.averageScore())
                .level(request.level())
                .image(request.image())
                .introduction(request.introduction())
                .build();
    }

    public static Member update(UpdateMemberRequest request, PasswordEncoder encoder, String memberId){
        return Member.builder()
                .id(memberId)
                .password(encoder.encode(request.password()))
                .nickname(request.nickname())
                .teeBox(request.teeBox())
                .topScore(request.topScore())
                .averageScore(request.averageScore())
                .level(request.level())
                .image(request.image())
                .introduction(request.introduction())
                .build();
    }

    @Override
    public String getUsername() {
        return id;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}