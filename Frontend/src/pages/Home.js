import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Add CSS animations and responsive styles
const slideUpAnimation = `
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInScale {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(79, 70, 229, 0.6);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes rotateIn {
  from {
    transform: rotate(-180deg) scale(0);
    opacity: 0;
  }
  to {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

@keyframes borderGlow {
  0%, 100% {
    border-color: rgba(79, 70, 229, 0.3);
    box-shadow: 0 0 10px rgba(79, 70, 229, 0.2);
  }
  50% {
    border-color: rgba(79, 70, 229, 0.8);
    box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
  }
}

@keyframes borderPulse {
  0% {
    border-color: rgba(79, 70, 229, 0.5);
    transform: scale(1);
  }
  50% {
    border-color: rgba(139, 92, 246, 0.8);
    transform: scale(1.02);
  }
  100% {
    border-color: rgba(79, 70, 229, 0.5);
    transform: scale(1);
  }
}

@keyframes rainbowBorder {
  0% { border-color: #4f46e5; }
  16.66% { border-color: #7c3aed; }
  33.33% { border-color: #db2777; }
  50% { border-color: #dc2626; }
  66.66% { border-color: #ea580c; }
  83.33% { border-color: #ca8a04; }
  100% { border-color: #4f46e5; }
}

/* Enhanced Carousel Animations */
.carousel-content-animated {
  transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1) !important;
}

.home-slide {
  animation: fadeInScale 0.8s ease-out;
}

.home-slide:nth-child(1) {
  animation-delay: 0.1s;
}

.home-slide:nth-child(2) {
  animation-delay: 0.2s;
}

.home-slide:nth-child(3) {
  animation-delay: 0.3s;
}

/* Parallax and Interactive Effects */
.parallax-bg {
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

/* Hover Effects */
.hover-lift:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1) !important;
}

.hover-glow:hover {
  animation: glow 2s infinite !important;
}

.hover-pulse:hover {
  animation: pulse 1s infinite !important;
}

.hover-float {
  animation: float 3s ease-in-out infinite !important;
}

/* Border Animation Effects */
.border-glow {
  animation: borderGlow 2s ease-in-out infinite;
  border: 2px solid rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
}

.border-pulse {
  animation: borderPulse 1.5s ease-in-out infinite;
  border: 2px solid rgba(79, 70, 229, 0.5);
}

.border-rainbow:hover {
  animation: rainbowBorder 2s linear infinite;
  border: 2px solid #4f46e5;
}

/* Loading and Entrance Animations */
.fade-in-up {
  animation: slideUp 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.2s;
}

.fade-in-left {
  animation: slideInLeft 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.3s;
}

.fade-in-right {
  animation: slideInRight 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.4s;
}

.bounce-in {
  animation: bounceIn 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.5s;
}

.rotate-in {
  animation: rotateIn 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.6s;
}

/* Staggered Animations */
.home-promo-banners .hover-lift:nth-child(1) {
  animation-delay: 0.1s;
}

.home-promo-banners .hover-lift:nth-child(2) {
  animation-delay: 0.2s;
}

.home-promo-banners .hover-lift:nth-child(3) {
  animation-delay: 0.3s;
}

.home-auth-panel .bounce-in:nth-child(1) {
  animation-delay: 0.2s;
}

.home-auth-panel .bounce-in:nth-child(2) {
  animation-delay: 0.4s;
}

/* Shimmer Effect */
.shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* Animated Background */
.animated-bg {
  position: relative;
  overflow: hidden;
}

.animated-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
  animation: float 6s ease-in-out infinite;
  pointer-events: none;
}

.animated-bg::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: rotate 20s linear infinite, pulse 4s ease-in-out infinite alternate;
  pointer-events: none;
}

/* Background Geometric Shapes */
.bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.bg-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  animation: floatShape 10s infinite ease-in-out;
}

.bg-shape:nth-child(1) {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 12s;
}

.bg-shape:nth-child(2) {
  width: 150px;
  height: 150px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
  animation-duration: 15s;
}

.bg-shape:nth-child(3) {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
  animation-duration: 10s;
}

.bg-shape:nth-child(4) {
  width: 120px;
  height: 120px;
  bottom: 30%;
  right: 25%;
  animation-delay: 6s;
  animation-duration: 14s;
}

.bg-shape:nth-child(5) {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 8s;
  animation-duration: 18s;
  opacity: 0.3;
}

@keyframes floatShape {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-40px) rotate(180deg);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-20px) rotate(270deg);
    opacity: 0.7;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Particle Animation System */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat 8s infinite linear;
}

.particle:nth-child(1) {
  width: 4px;
  height: 4px;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 10s;
}

.particle:nth-child(2) {
  width: 6px;
  height: 6px;
  left: 20%;
  animation-delay: 1s;
  animation-duration: 12s;
}

.particle:nth-child(3) {
  width: 3px;
  height: 3px;
  left: 30%;
  animation-delay: 2s;
  animation-duration: 8s;
}

.particle:nth-child(4) {
  width: 5px;
  height: 5px;
  left: 40%;
  animation-delay: 3s;
  animation-duration: 15s;
}

.particle:nth-child(5) {
  width: 4px;
  height: 4px;
  left: 50%;
  animation-delay: 4s;
  animation-duration: 11s;
}

.particle:nth-child(6) {
  width: 7px;
  height: 7px;
  left: 60%;
  animation-delay: 5s;
  animation-duration: 9s;
}

.particle:nth-child(7) {
  width: 3px;
  height: 3px;
  left: 70%;
  animation-delay: 6s;
  animation-duration: 13s;
}

.particle:nth-child(8) {
  width: 5px;
  height: 5px;
  left: 80%;
  animation-delay: 7s;
  animation-duration: 10s;
}

.particle:nth-child(9) {
  width: 4px;
  height: 4px;
  left: 90%;
  animation-delay: 8s;
  animation-duration: 14s;
}

@keyframes particleFloat {
  0% {
    bottom: -10px;
    opacity: 0;
    transform: translateX(0px) rotate(0deg);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    bottom: 100vh;
    opacity: 0;
    transform: translateX(100px) rotate(360deg);
  }
}

/* Wave Animations */
.waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(60deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  border-radius: 50%;
  animation: waveMove 6s ease-in-out infinite;
}

.wave:nth-child(1) {
  animation-delay: 0s;
  animation-duration: 8s;
  opacity: 0.7;
}

.wave:nth-child(2) {
  animation-delay: 2s;
  animation-duration: 12s;
  opacity: 0.5;
}

.wave:nth-child(3) {
  animation-delay: 4s;
  animation-duration: 10s;
  opacity: 0.3;
}

@keyframes waveMove {
  0%, 100% {
    transform: translateX(-50%) translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateX(-40%) translateY(-10px) rotate(90deg);
  }
  50% {
    transform: translateX(-30%) translateY(-20px) rotate(180deg);
  }
  75% {
    transform: translateX(-40%) translateY(-10px) rotate(270deg);
  }
}

/* Gradient Morphing */
.gradient-morph {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1), rgba(240,147,251,0.1));
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Parallax Background Layers */
.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 120%;
  height: 120%;
  pointer-events: none;
}

.parallax-layer-1 {
  background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
  animation: parallax1 20s linear infinite;
  z-index: 1;
}

.parallax-layer-2 {
  background: radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%);
  animation: parallax2 30s linear infinite reverse;
  z-index: 1;
}

.parallax-layer-3 {
  background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.06) 0%, transparent 50%);
  animation: parallax3 25s linear infinite;
  z-index: 1;
}

@keyframes parallax1 {
  0% {
    transform: translateX(-10%) translateY(-10%) rotate(0deg);
  }
  100% {
    transform: translateX(10%) translateY(10%) rotate(360deg);
  }
}

@keyframes parallax2 {
  0% {
    transform: translateX(5%) translateY(-5%) rotate(0deg) scale(1.1);
  }
  100% {
    transform: translateX(-5%) translateY(5%) rotate(-360deg) scale(1.1);
  }
}

@keyframes parallax3 {
  0% {
    transform: translateX(-5%) translateY(5%) rotate(0deg) scale(0.9);
  }
  100% {
    transform: translateX(5%) translateY(-5%) rotate(180deg) scale(0.9);
  }
}

/* SVG Background Animations */
.svg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.1;
}

.geometric-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 1px, transparent 1px),
    linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 100px 100px, 150px 150px, 80px 80px;
  background-position: 0 0, 50px 50px, 25px 25px;
  animation: patternMove 30s linear infinite;
}

@keyframes patternMove {
  0% {
    background-position: 0 0, 50px 50px, 25px 25px;
  }
  100% {
    background-position: 100px 100px, 150px 150px, 105px 105px;
  }
}

/* Orb Animations */
.floating-orbs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
  filter: blur(1px);
  animation: orbFloat 15s ease-in-out infinite;
}

.orb:nth-child(1) {
  width: 60px;
  height: 60px;
  top: 20%;
  left: 15%;
  animation-delay: 0s;
  animation-duration: 18s;
}

.orb:nth-child(2) {
  width: 40px;
  height: 40px;
  top: 60%;
  right: 20%;
  animation-delay: 5s;
  animation-duration: 22s;
}

.orb:nth-child(3) {
  width: 80px;
  height: 80px;
  bottom: 30%;
  left: 10%;
  animation-delay: 10s;
  animation-duration: 20s;
}

@keyframes orbFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-30px) translateX(20px) scale(1.1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-60px) translateX(-10px) scale(0.9);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-30px) translateX(-20px) scale(1.05);
    opacity: 0.7;
  }
}

/* Enhanced Responsive Styles */
@media (max-width: 1200px) {
  .home-content-wrapper {
    grid-template-columns: 1.1fr 0.9fr !important;
    gap: 1.5rem !important;
  }
  
  .home-carousel {
    height: 45vh !important;
    min-height: 280px !important;
    max-height: 380px !important;
  }
  
  .home-slide {
    padding: 1.8rem !important;
  }
}

@media (max-width: 968px) {
  .home-content-wrapper {
    grid-template-columns: 1fr !important;
    gap: 2rem !important;
    padding: 0 1rem !important;
  }
  
  .home-carousel {
    height: 40vh !important;
    min-height: 250px !important;
    max-height: 350px !important;
  }
  
  .home-auth-panel {
    order: -1 !important;
    margin-bottom: 1rem !important;
  }
}

@media (max-width: 768px) {
  .home-content-wrapper {
    grid-template-columns: 1fr !important;
    gap: 1.5rem !important;
    padding: 0 1rem !important;
  }
  
  .home-header-content {
    flex-direction: column !important;
    text-align: center !important;
    gap: 1rem !important;
    padding: 0 1rem !important;
  }
  
  .home-nav {
    flex-direction: row !important;
    gap: 1rem !important;
    justify-content: center !important;
    flex-wrap: wrap !important;
  }
  
  .home-carousel {
    height: 35vh !important;
    min-height: 220px !important;
    max-height: 300px !important;
  }
  
  .home-slide-title {
    font-size: clamp(1.2rem, 4vw, 1.8rem) !important;
  }
  
  .home-slide-subtitle {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem) !important;
  }
  
  .home-slide-content {
    padding-left: 0 !important;
    text-align: center !important;
  }
  
  .home-slide {
    flex-direction: column !important;
    text-align: center !important;
    padding: 1.5rem !important;
  }
  
  .home-slide-image {
    flex: 0 0 auto !important;
    margin-bottom: 1rem !important;
    max-width: 150px !important;
  }
  
  .home-auth-title {
    font-size: clamp(1.3rem, 4vw, 1.8rem) !important;
  }
  
  .home-promo-banners {
    grid-template-columns: 1fr !important;
  }
  
  .home-auth-panel {
    padding: clamp(1.2rem, 3vw, 2rem) !important;
  }
  
  .home-primary-button, .home-secondary-button {
    padding: clamp(0.6rem, 2vw, 0.8rem) clamp(1.2rem, 3vw, 1.5rem) !important;
    font-size: clamp(0.8rem, 2vw, 0.95rem) !important;
  }
}

@media (max-width: 640px) {
  .home-content-wrapper {
    padding: 0 0.8rem !important;
    gap: 1.2rem !important;
  }
  
  .home-carousel {
    height: 32vh !important;
    min-height: 200px !important;
    max-height: 280px !important;
    border-radius: 15px !important;
  }
  
  .home-slide {
    padding: 1.2rem !important;
  }
  
  .home-slide-actions {
    flex-direction: column !important;
    gap: 0.8rem !important;
    align-items: center !important;
  }
  
  .home-nav {
    gap: 0.8rem !important;
    font-size: 0.9rem !important;
  }
}

@media (max-width: 480px) {
  .home-content-wrapper {
    padding: 0 0.5rem !important;
    gap: 1rem !important;
  }
  
  .home-carousel {
    height: 30vh !important;
    min-height: 180px !important;
    max-height: 250px !important;
    border-radius: 12px !important;
  }
  
  .home-slide-title {
    font-size: clamp(1rem, 4.5vw, 1.4rem) !important;
    line-height: 1.2 !important;
  }
  
  .home-slide-subtitle {
    font-size: clamp(0.8rem, 3vw, 1rem) !important;
    line-height: 1.4 !important;
  }
  
  .home-auth-panel {
    padding: clamp(1rem, 3vw, 1.5rem) !important;
    border-radius: 15px !important;
  }
  
  .home-slide {
    padding: 1rem !important;
  }
  
  .home-slide-image {
    max-width: 120px !important;
  }
  
  .home-nav {
    gap: 0.5rem !important;
    font-size: 0.85rem !important;
  }
  
  .home-footer-content {
    grid-template-columns: 1fr !important;
    padding: 0 1rem !important;
    gap: 1.5rem !important;
  }
  
  .home-promo-banner {
    flex-direction: column !important;
    text-align: center !important;
    padding: 1rem !important;
  }
  
  .home-primary-button, .home-secondary-button {
    width: 100% !important;
    text-align: center !important;
  }
}

@media (max-width: 360px) {
  .home-content-wrapper {
    padding: 0 0.3rem !important;
  }
  
  .home-carousel {
    height: 28vh !important;
    min-height: 160px !important;
    max-height: 220px !important;
  }
  
  .home-slide {
    padding: 0.8rem !important;
  }
  
  .home-slide-title {
    font-size: clamp(0.9rem, 5vw, 1.2rem) !important;
  }
  
  .home-slide-subtitle {
    font-size: clamp(0.75rem, 3.5vw, 0.9rem) !important;
  }
  
  .home-auth-panel {
    padding: 0.8rem !important;
  }
  
  .home-nav {
    font-size: 0.8rem !important;
  }
}

/* Navigation Responsive Styles */
@media (max-width: 1024px) {
  .home-page header [style*="topNavContainer"] {
    padding: 0 clamp(1rem, 2.5vw, 2rem) !important;
    gap: clamp(0.8rem, 1.5vw, 1.5rem) !important;
    grid-template-columns: minmax(200px, 250px) 1fr minmax(180px, 220px) !important;
  }
  
  .home-page nav [style*="topNavMenu"] {
    gap: clamp(1rem, 2.5vw, 1.5rem) !important;
    max-width: 500px !important;
  }
  
  .home-page [style*="navDropdownBtn"] {
    font-size: clamp(0.8rem, 1.6vw, 0.9rem) !important;
    padding: clamp(0.4rem, 1.2vh, 0.6rem) clamp(0.4rem, 0.8vw, 0.6rem) !important;
  }
}

@media (max-width: 768px) {
  .home-page header [style*="topNavContainer"] {
    display: flex !important;
    flex-direction: column !important;
    padding: 1rem clamp(1rem, 3vw, 2rem) !important;
    min-height: auto !important;
    gap: 1rem !important;
    grid-template-columns: none !important;
  }
  
  .home-page [style*="navLeft"] {
    width: 100% !important;
    justify-content: center !important;
  }
  
  .home-page nav [style*="topNavMenu"] {
    width: 100% !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    gap: clamp(1rem, 3vw, 2rem) !important;
    min-width: auto !important;
  }
  
  .home-page [style*="navRight"] {
    width: 100% !important;
    justify-content: center !important;
  }
  
  .home-page [style*="navDropdownBtn"] {
    font-size: 0.9rem !important;
    padding: 0.5rem 1rem !important;
  }
  
  .home-page [style*="topNavLogin"] {
    padding: 0.5rem 1rem !important;
    font-size: 0.9rem !important;
  }
  
  .home-page [style*="topNavCta"] {
    padding: 0.6rem 1.2rem !important;
    font-size: 0.9rem !important;
  }
}

@media (max-width: 480px) {
  .home-page header [style*="topNavContainer"] {
    padding: 0 0.8rem !important;
    min-height: auto !important;
    padding-top: 0.8rem !important;
    padding-bottom: 0.8rem !important;
  }
  
  .home-page nav [style*="topNavMenu"] {
    gap: 0.8rem !important;
  }
  
  .home-page [style*="navDropdownBtn"] {
    font-size: 0.8rem !important;
    padding: 0.4rem 0 !important;
  }
  
  .home-page [style*="logoText"] {
    font-size: 1.3rem !important;
  }
  
  .home-page [style*="logoIcon"] {
    width: 35px !important;
    height: 35px !important;
  }
  
  .home-page [style*="topNavActions"] {
    gap: 0.5rem !important;
  }
}

/* Landscape orientation adjustments */
@media (max-height: 600px) and (orientation: landscape) {
  .home-carousel {
    height: 60vh !important;
    min-height: 200px !important;
    max-height: 350px !important;
  }
  
  .home-content-wrapper {
    grid-template-columns: 1.3fr 0.7fr !important;
    align-items: start !important;
    padding-top: 1rem !important;
  }
  
  .home-main {
    padding: 0.5rem 0 !important;
  }
}

/* Ultra-wide screen adjustments */
@media (min-width: 1920px) {
  .home-content-wrapper {
    max-width: 1800px !important;
    grid-template-columns: 1.4fr 0.6fr !important;
  }
  
  .home-carousel {
    height: 55vh !important;
    max-height: 500px !important;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .home-slide-img {
    image-rendering: -webkit-optimize-contrast !important;
    image-rendering: crisp-edges !important;
  }
}
`;

// Top Navigation CSS
const topNavCSS = `
/* Top Navigation Dropdown Styles */
.nav-dropdown:hover .dropdown-content {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(0) !important;
}

.nav-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg) !important;
}

.nav-dropdown .nav-dropdown-btn:hover {
  color: #1e40af !important;
}

.dropdown-link:hover {
  background-color: #f8fafc !important;
  color: #1e40af !important;
  transform: translateX(4px) !important;
}

.top-nav-login:hover {
  background-color: #f1f5f9 !important;
  color: #1e40af !important;
}

.top-nav-cta:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4) !important;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .top-nav-menu {
    display: none !important;
  }
  
  .top-nav-container {
    padding: 0 1rem !important;
  }
}
`;

// Inject CSS
if (!document.querySelector('#slide-up-animation')) {
  const style = document.createElement('style');
  style.id = 'slide-up-animation';
  style.textContent = slideUpAnimation;
  document.head.appendChild(style);
}

// Inject Top Nav CSS
if (!document.querySelector('#top-nav-css')) {
  const topNavStyle = document.createElement('style');
  topNavStyle.id = 'top-nav-css';
  topNavStyle.textContent = topNavCSS;
  document.head.appendChild(topNavStyle);
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Carousel images and content
  const carouselSlides = [
    {
      image: '/images/rail-transport.svg',
      title: 'Rail Distribution Solutions',
      subtitle: 'Specialized packaging for efficient rail transportation networks and cargo handling',
      accent: '#4facfe'
    },
    {
      image: '/images/road-transport.svg',
      title: 'Road Distribution Network',
      subtitle: 'Comprehensive road transport solutions with advanced logistics infrastructure',
      accent: '#667eea'
    },
    {
      image: '/images/supply-chain-network.svg',
      title: 'Supply Chain Optimization',
      subtitle: 'Cost-effective packaging solutions for integrated rail and road transportation',
      accent: '#f093fb'
    },
    {
      image: '/images/smart-warehouse.svg',
      title: 'Smart Warehouse Solutions',
      subtitle: 'Automated inventory management and intelligent storage systems for maximum efficiency',
      accent: '#fd746c'
    },
    {
      image: process.env.PUBLIC_URL + '/images/customer-support-new.svg',
      title: '24/7 Customer Support',
      subtitle: 'Multi-channel customer service with 95% satisfaction rate and instant response',
      accent: '#ff9068'
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  // Fade in animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="animated-bg" style={styles.container}>
      {/* Background Animation Layers */}
      <div className="gradient-morph"></div>
      
      {/* Parallax Background Layers */}
      <div className="parallax-layer parallax-layer-1"></div>
      <div className="parallax-layer parallax-layer-2"></div>
      <div className="parallax-layer parallax-layer-3"></div>
      
      {/* Floating Geometric Shapes */}
      <div className="bg-shapes">
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      {/* Floating Orbs */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>
      
      {/* Wave Animations */}
      <div className="waves">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      
      {/* SVG Pattern Overlay */}
      <div className="svg-overlay">
        <div className="geometric-pattern"></div>
      </div>

      {/* Top Navigation Bar */}
      <header style={styles.topNavBar}>
        <div style={styles.topNavContainer}>
          {/* Left Section - Logo */}
          <div style={styles.navLeft}>
            <div style={styles.logo}>
              <img src="/images/kandypack-logo.svg" alt="KandyPack" style={styles.logoIcon} />
              <span style={styles.logoText}>KandyPack</span>
            </div>
          </div>
          
          {/* Center Section - Navigation Menu */}
          <nav style={styles.topNavMenu}>
            <div className="nav-dropdown" style={styles.navDropdown}>
              <button className="nav-dropdown-btn" style={styles.navDropdownBtn}>
                Products <span className="dropdown-arrow" style={styles.dropdownArrow}>▼</span>
              </button>
              <div className="dropdown-content" style={styles.dropdownContent}>
                <Link to="/products/tracking" className="dropdown-link" style={styles.dropdownLink}>Supply Chain Tracking</Link>
                <Link to="/products/management" className="dropdown-link" style={styles.dropdownLink}>Fleet Management</Link>
                <Link to="/products/analytics" className="dropdown-link" style={styles.dropdownLink}>Route Analytics</Link>
                <Link to="/products/monitoring" className="dropdown-link" style={styles.dropdownLink}>Equipment Monitoring</Link>
              </div>
            </div>
            
            <div className="nav-dropdown" style={styles.navDropdown}>
              <button className="nav-dropdown-btn" style={styles.navDropdownBtn}>
                Solutions <span className="dropdown-arrow" style={styles.dropdownArrow}>▼</span>
              </button>
              <div className="dropdown-content" style={styles.dropdownContent}>
                <Link to="/solutions/logistics" className="dropdown-link" style={styles.dropdownLink}>Logistics</Link>
                <Link to="/solutions/transportation" className="dropdown-link" style={styles.dropdownLink}>Transportation</Link>
                <Link to="/solutions/distribution" className="dropdown-link" style={styles.dropdownLink}>Distribution</Link>
                <Link to="/solutions/enterprise" className="dropdown-link" style={styles.dropdownLink}>Enterprise</Link>
              </div>
            </div>
            
            <div className="nav-dropdown" style={styles.navDropdown}>
              <button className="nav-dropdown-btn" style={styles.navDropdownBtn}>
                Resources <span className="dropdown-arrow" style={styles.dropdownArrow}>▼</span>
              </button>
              <div className="dropdown-content" style={styles.dropdownContent}>
                <Link to="/resources/blog" className="dropdown-link" style={styles.dropdownLink}>Blog</Link>
                <Link to="/resources/guides" className="dropdown-link" style={styles.dropdownLink}>Guides</Link>
                <Link to="/resources/support" className="dropdown-link" style={styles.dropdownLink}>Support</Link>
                <Link to="/resources/docs" className="dropdown-link" style={styles.dropdownLink}>Documentation</Link>
              </div>
            </div>
            
            <div className="nav-dropdown" style={styles.navDropdown}>
              <button className="nav-dropdown-btn" style={styles.navDropdownBtn}>
                Company <span className="dropdown-arrow" style={styles.dropdownArrow}>▼</span>
              </button>
              <div className="dropdown-content" style={styles.dropdownContent}>
                <Link to="/company/about" className="dropdown-link" style={styles.dropdownLink}>About Us</Link>
                <Link to="/company/careers" className="dropdown-link" style={styles.dropdownLink}>Careers</Link>
                <Link to="/company/contact" className="dropdown-link" style={styles.dropdownLink}>Contact</Link>
                <Link to="/company/news" className="dropdown-link" style={styles.dropdownLink}>News</Link>
              </div>
            </div>
          </nav>
          
          {/* Right Section - Action Buttons */}
          <div style={styles.navRight}>
            <div style={styles.topNavActions}>
             
              <Link to="/login/employee" className="top-nav-login" style={{...styles.topNavLogin, marginLeft: '0.5rem'}}>Employee Portal</Link>
              <Link to="/signup" className="top-nav-cta" style={styles.topNavCta}>Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div className="home-content-wrapper" style={styles.contentWrapper}>
          {/* Left Side - Carousel */}
          <div className="fade-in-left" style={styles.leftSide}>
            <div className="hover-lift" style={styles.carousel}>
              <div 
                style={{
                  ...styles.carouselContent,
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
                className="carousel-content-animated"
              >
                {carouselSlides.map((slide, index) => (
                  <div key={index} className="home-slide" style={styles.slide}>
                    <div style={styles.slideImage}>
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        style={styles.slideImg}
                        onError={e => { e.target.onerror = null; e.target.src = process.env.PUBLIC_URL + '/images/product-placeholder.svg'; }}
                      />
                    </div>
                    <div className="home-slide-content" style={styles.slideContent}>
                      <h2 className="home-slide-title" style={{
                        ...styles.slideTitle,
                        color: slide.accent
                      }}>
                        {slide.title}
                      </h2>
                      <p className="home-slide-subtitle" style={styles.slideSubtitle}>
                        {slide.subtitle}
                      </p>
                      <div style={styles.slideActions}>
                        <Link 
                          to="/products" 
                          className="hover-lift hover-glow"
                          style={{
                            ...styles.primaryButton,
                            backgroundColor: slide.accent
                          }}
                        >
                          Browse Products
                        </Link>
                        <Link to="/signup" className="hover-lift" style={styles.secondaryButton}>
                          Get Started
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promotional Banners */}
            <div className="home-promo-banners bounce-in" style={styles.promoBanners}>
              <div className="hover-lift hover-float" style={styles.promoBanner}>
                <span className="rotate-in" style={styles.promoIcon}>🚂</span>
                <div style={styles.promoText}>
                  <span style={styles.promoTitle}>Rail Network Integration</span>
                  <span style={styles.promoDesc}>Efficient long-distance logistics</span>
                </div>
              </div>
              <div className="hover-lift hover-float" style={styles.promoBanner}>
                <span className="rotate-in" style={styles.promoIcon}>🚛</span>
                <div style={styles.promoText}>
                  <span style={styles.promoTitle}>Road Distribution</span>
                  <span style={styles.promoDesc}>Last-mile delivery solutions</span>
                </div>
              </div>
              <div className="hover-lift hover-float" style={styles.promoBanner}>
                <span className="rotate-in" style={styles.promoIcon}>📦</span>
                <div style={styles.promoText}>
                  <span style={styles.promoTitle}>Supply Chain Packaging</span>
                  <span style={styles.promoDesc}>Multi-modal transport ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Panel */}
          <div className="fade-in-right" style={{
            ...styles.rightSide,
            ...(isVisible ? styles.rightSideVisible : {})
          }}>
            <div className="home-auth-panel hover-lift" style={styles.authPanel}>
              <div style={styles.authHeader}>
                <h1 className="home-auth-title" style={styles.authTitle}>KandyPack Distribution Hub</h1>
                <p style={styles.authSubtitle}>Rail & Road Supply Chain Solutions</p>
              </div>

              {/* Quick Actions */}
              <div style={styles.quickActions}>
                <Link to="/login" style={styles.actionLink}>
                  <div className="hover-lift hover-glow shimmer border-glow border-rainbow" style={styles.primaryAction}>
                    <span className="bounce-in" style={styles.actionIcon}>🔐</span>
                    <div style={styles.actionContent}>
                      <span style={styles.actionTitle}>Customer Login</span>
                      <span style={styles.actionDesc}>Access your account</span>
                    </div>
                    <span className="hover-pulse" style={styles.actionArrow}>→</span>
                  </div>
                </Link>

                <Link to="/login/employee" style={styles.actionLink}>
                  <div className="hover-lift border-pulse border-rainbow" style={styles.secondaryAction}>
                    <span className="bounce-in" style={styles.actionIcon}>👨‍💼</span>
                    <div style={styles.actionContent}>
                      <span style={styles.actionTitle}>Employee Portal</span>
                      <span style={styles.actionDesc}>Admin, Driver, Assistant</span>
                    </div>
                    <span className="hover-pulse" style={styles.actionArrow}>→</span>
                  </div>
                </Link>

                <Link to="/signup" style={styles.actionLink}>
                  <div className="hover-lift border-pulse border-rainbow" style={styles.secondaryAction}>
                    <span className="bounce-in" style={styles.actionIcon}>👤</span>
                    <div style={styles.actionContent}>
                      <span style={styles.actionTitle}>Sign Up</span>
                      <span style={styles.actionDesc}>Create new account</span>
                    </div>
                    <span className="hover-pulse" style={styles.actionArrow}>→</span>
                  </div>
                </Link>
              </div>

              {/* Feature Highlights */}
              <div className="fade-in-up" style={styles.features}>
                <div className="hover-float" style={styles.feature}>
                  <span className="rotate-in" style={styles.featureIcon}>📦</span>
                  <span style={styles.featureText}>Professional Packaging</span>
                </div>
                <div className="hover-float" style={styles.feature}>
                  <span className="rotate-in" style={styles.featureIcon}>🌍</span>
                  <span style={styles.featureText}>Worldwide Delivery</span>
                </div>
                <div className="hover-float" style={styles.feature}>
                  <span className="rotate-in" style={styles.featureIcon}>⭐</span>
                  <span style={styles.featureText}>Trusted Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="home-footer-content" style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>KandyPack Distribution</h4>
            <p style={styles.footerText}>
              Leading provider of specialized packaging solutions for rail and road supply chain networks.
            </p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Services</h4>
            <Link to="/products" style={styles.footerLink}>Rail Logistics</Link>
            <Link to="/products" style={styles.footerLink}>Road Distribution</Link>
            <Link to="/products" style={styles.footerLink}>Supply Chain Solutions</Link>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Account</h4>
            <Link to="/login" style={styles.footerLink}>Customer Login</Link>
            <Link to="/login/employee" style={styles.footerLink}>Employee Portal</Link>
            <Link to="/signup" style={styles.footerLink}>Sign Up</Link>
            {isAuthenticated && (
              <Link to={user?.role === 'customer' ? '/customer' : '/employee'} style={styles.footerLink}>
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    width: '100vw',
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
  },
  // Top Navigation Styles
  topNavBar: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  topNavContainer: {
    maxWidth: '100%',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'minmax(250px, 300px) 1fr minmax(250px, 350px)',
    alignItems: 'center',
    padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
    minHeight: '70px',
    width: '100%',
    boxSizing: 'border-box',
    gap: 'clamp(1rem, 2vw, 2rem)',
  },
  navLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  navRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minWidth: '200px',
  },
  topNavMenu: {
    display: 'flex',
    gap: 'clamp(1.2rem, 3vw, 2rem)',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  navDropdown: {
    position: 'relative',
  },
  navDropdownBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontWeight: '500',
    padding: 'clamp(0.5rem, 1.5vh, 0.8rem) clamp(0.5rem, 1vw, 0.8rem)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
    transition: 'color 0.2s ease',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    borderRadius: '6px',
  },
  dropdownArrow: {
    fontSize: '0.8rem',
    transition: 'transform 0.2s ease',
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    background: 'white',
    minWidth: 'clamp(180px, 25vw, 200px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    borderRadius: '8px',
    padding: '0.5rem 0',
    opacity: 0,
    visibility: 'hidden',
    transform: 'translateY(-10px)',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0',
    zIndex: 1001,
  },
  dropdownLink: {
    display: 'block',
    padding: 'clamp(0.6rem, 1.5vh, 0.75rem) clamp(0.8rem, 2vw, 1rem)',
    color: '#64748b',
    textDecoration: 'none',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  topNavActions: {
    display: 'flex',
    gap: 'clamp(0.8rem, 1.5vw, 1rem)',
    alignItems: 'center',
  },
  topNavLogin: {
    color: '#64748b',
    textDecoration: 'none',
    fontWeight: '500',
    padding: 'clamp(0.5rem, 1.5vw, 0.5rem) clamp(0.8rem, 2vw, 1rem)',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
    whiteSpace: 'nowrap',
  },
  topNavCta: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    padding: 'clamp(0.6rem, 2vh, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
    whiteSpace: 'nowrap',
  },
  // Logo Styles
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.5rem, 2vw, 0.75rem)',
    flexShrink: 0,
  },
  logoIcon: {
    width: 'clamp(35px, 5vw, 40px)',
    height: 'clamp(35px, 5vw, 40px)',
  },
  logoText: {
    fontSize: 'clamp(1.3rem, 3vw, 1.5rem)',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: 'clamp(1rem, 3vh, 2rem) 0',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 100,
    minHeight: 'calc(100vh - clamp(5rem, 10vh, 7rem))',
  },
  contentWrapper: {
    maxWidth: '100%',
    width: '100%',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: 'clamp(1.5rem, 4vw, 3rem)',
    padding: '0 clamp(1rem, 3vw, 2rem)',
    alignItems: 'center',
    boxSizing: 'border-box',
    minHeight: 'inherit',
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(1.5rem, 3vh, 2.5rem)',
    width: '100%',
    boxSizing: 'border-box',
  },
  carousel: {
    position: 'relative',
    borderRadius: 'clamp(15px, 2vw, 25px)',
    overflow: 'hidden',
    height: 'clamp(300px, 50vh, 450px)',
    minHeight: '280px',
    maxHeight: '500px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    width: '100%',
    backdropFilter: 'blur(10px)',
    aspectRatio: '16/9',
    boxSizing: 'border-box',
  },
  carouselContent: {
    display: 'flex',
    height: '100%',
    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  slide: {
    minWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: 'clamp(1.5rem, 4vw, 3rem)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden',
    minHeight: '100%',
  },
  slideImage: {
    flex: '0 0 clamp(30%, 8vw, 40%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 'clamp(150px, 20vw, 250px)',
  },
  slideImg: {
    width: '100%',
    height: 'auto',
    maxWidth: 'clamp(150px, 18vw, 220px)',
    maxHeight: 'clamp(150px, 18vh, 220px)',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
  },
  slideContent: {
    flex: 1,
    color: 'white',
    paddingLeft: 'clamp(1rem, 3vw, 2rem)',
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
  slideTitle: {
    fontSize: 'clamp(1.5rem, 4.5vw, 2.8rem)',
    fontWeight: 'bold',
    marginBottom: 'clamp(0.8rem, 2vh, 1.5rem)',
    lineHeight: '1.2',
    wordWrap: 'break-word',
    hyphens: 'auto',
  },
  slideSubtitle: {
    fontSize: 'clamp(1rem, 2.8vw, 1.4rem)',
    marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
    opacity: 0.9,
    lineHeight: '1.5',
    wordWrap: 'break-word',
    hyphens: 'auto',
  },
  slideActions: {
    display: 'flex',
    gap: 'clamp(0.8rem, 2vw, 1.5rem)',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  primaryButton: {
    padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    transition: 'transform 0.2s',
    display: 'inline-block',
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
  },
  secondaryButton: {
    padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    border: '2px solid white',
    transition: 'transform 0.2s',
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
  },
  promoBanners: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  promoBanner: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    padding: '1.5rem',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  promoIcon: {
    fontSize: '2rem',
  },
  promoText: {
    display: 'flex',
    flexDirection: 'column',
  },
  promoTitle: {
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.25rem',
  },
  promoDesc: {
    fontSize: '0.875rem',
    color: '#64748b',
  },
  rightSide: {
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.8s ease-out',
    width: '100%',
    boxSizing: 'border-box',
  },
  rightSideVisible: {
    opacity: 1,
    transform: 'translateY(0)',
    animation: 'slideUp 0.8s ease-out',
  },
  authPanel: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
    borderRadius: 'clamp(15px, 2vw, 25px)',
    padding: 'clamp(1.5rem, 4vw, 3.5rem)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    backdropFilter: 'blur(10px)',
    maxWidth: '100%',
  },
  authHeader: {
    textAlign: 'center',
    marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
  },
  authTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 'clamp(0.8rem, 2vh, 1.2rem)',
    lineHeight: '1.2',
  },
  authSubtitle: {
    color: '#64748b',
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    lineHeight: '1.5',
  },
  quickActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  actionLink: {
    textDecoration: 'none',
  },
  primaryAction: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    borderRadius: '15px',
    color: 'white',
    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3)',
  },
  secondaryAction: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
    borderRadius: '15px',
    color: '#1e293b',
    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
    cursor: 'pointer',
    border: '2px solid #e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  actionIcon: {
    fontSize: '1.5rem',
    marginRight: '1rem',
  },
  actionContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  actionTitle: {
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  actionDesc: {
    fontSize: '0.875rem',
    opacity: 0.8,
  },
  actionArrow: {
    fontSize: '1.2rem',
    marginLeft: '1rem',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
  },
  featureIcon: {
    fontSize: '1.5rem',
  },
  featureText: {
    color: '#1e293b',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: 'clamp(2rem, 4vw, 3rem) 0 1rem',
    marginTop: 'auto',
  },
  footerContent: {
    maxWidth: '100%',
    width: '100%',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    padding: '0 1rem',
    boxSizing: 'border-box',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  footerTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: 'white',
  },
  footerText: {
    color: '#94a3b8',
    lineHeight: '1.6',
  },
  footerLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.2s',
    cursor: 'pointer',
  },
};