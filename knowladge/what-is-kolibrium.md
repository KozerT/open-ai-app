---
description: Discover Kolibrium, a declarative Kotlin library that simplifies Selenium test automation with modular, powerful modules
keywords:
  - selenium
  - webdriver
  - kotlin
  - page object
  - locator delegates
  - decorators
  - Domain-Specific Languages
  - junit
  - code generation
  - web testing
  - test automation
  - test library
  - automated testing
title: What is Kolibrium?
title_meta: "Kolibrium: Streamlined Selenium Testing in Kotlin"
---

Kolibrium is a declarative Kotlin library designed to reduce boilerplate code and find better abstractions to express Selenium tests in a compact way. Quickly bring your test automation efforts to life with less code and easy-to-read APIs.

Kolibrium is divided into several subprojects (modules), each of which can be used either independently or in conjunction with others.

- `selenium`: offers a range of delegate functions for locating elements and decorating WebDriver instances
- `ksp`: offers code generation with [Kotlin Symbol Processing (KSP)](https://kotlinlang.org/docs/ksp-overview.html) for part of the Page Object classes
- `dsl`: offers [Domain-Specific Languages (DSLs)](https://kotlinlang.org/docs/type-safe-builders.html) functions for creating, configuring, and interacting with driver instances
- `junit`: offers an extension to write JUnit tests without boilerplate

You can decide to go all-in on Kolibrium by opting for all four modules or choosing just one or two. For example, you could use the Selenium library in conjunction with DSL and JUnit, or you could use Selenium with KSP.  