# Feature Stack Split - Completion Plan

## Overview
This document tracks the completion of the feature-stack.js split (#228 Phase 2) to extract the three natural sub-domains (motd, playlist, poll) into separate, testable modules.

## Current Status
✅ **Phase 1 Complete**: Three stack modules extracted
- `src/modules/stack/stack-motd.ts` - MOTD panel management
- `src/modules/stack/stack-playlist.ts` - Playlist controls and queue preview
- `src/modules/stack/stack-poll.ts` - Poll panel management

📋 **Phase 2 Remaining**: Consolidate remaining feature-stack.js logic into stack modules

## Remaining Work in feature-stack.js

### 1. Main Stack Shell Logic (Core Infrastructure)
**Location**: `src/modules/feature-stack.js` (lines ~1-200)
**Tasks**:
- [ ] Move `ensureStack()` function to `stack-core.ts` or create `stack-shell.ts`
- [ ] Move `createGroupItem()` function to appropriate stack module
- [ ] Move panel bar creation and management to `stack-core.ts`
- [ ] Move flyout group management to `stack-core.ts`
- [ ] Move stack visibility toggle logic to `stack-core.ts`
- [ ] Move panel dock button logic to `stack-core.ts`
- [ ] Move up/down reordering logic to `stack-core.ts`

### 2. Panel Bar & Flyout Management
**Location**: `src/modules/feature-stack.js` (lines ~200-400)
**Tasks**:
- [ ] Move panel bar creation to `stack-core.ts`
- [ ] Move flyout open/close logic to `stack-core.ts`
- [ ] Move flyout close timer management to `stack-core.ts`
- [ ] Move panel bar signature tracking to `stack-core.ts`
- [ ] Move panel bar wiring logic to `stack-core.ts`

### 3. Stack Population Logic
**Location**: `src/modules/feature-stack.js` (lines ~400-600)
**Tasks**:
- [ ] Move `populate()` function to `stack-core.ts`
- [ ] Move `stackGroupsSatisfied()` function to `stack-core.ts`
- [ ] Move element grouping logic to `stack-core.ts`
- [ ] Move saved order loading/saving to `stack-core.ts`
- [ ] Move safety checks and error handling to `stack-core.ts`

### 4. Footer & UI Integration
**Location**: `src/modules/feature-stack.js` (lines ~600-800)
**Tasks**:
- [ ] Move `attachFooter()` function to `stack-core.ts`
- [ ] Move footer attachment logic to `stack-core.ts`
- [ ] Move stack header actions relocation to `stack-core.ts`

### 5. Visibility & State Management
**Location**: `src/modules/feature-stack.js` (lines ~800-1000)
**Tasks**:
- [ ] Move visibility toggle attachment to `stack-core.ts`
- [ ] Move panel open state management to `stack-core.ts`
- [ ] Move stored visibility loading to `stack-core.ts`
- [ ] Move docked state management to `stack-core.ts`

## Module Refactoring Plan

### Stack Core Module (`stack-core.ts`)
**Purpose**: Shared infrastructure for all stack sub-domains
**Responsibilities**:
- Stack shell creation and management
- Panel bar and flyout system
- Stack population and ordering
- Visibility and state persistence
- Panel docking system
- Error handling and safety checks

**Files to Update**:
- `src/lib/stack-core.ts` - Expand with extracted functionality
- `src/modules/feature-stack.js` - Remove migrated functionality
- `src/modules/stack/stack-motd.ts` - Update imports/context
- `src/modules/stack/stack-playlist.ts` - Update imports/context
- `src/modules/stack/stack-poll.ts` - Update imports/context

### Stack Motd Module (`stack-motd.ts`)
**Current Status**: ✅ Complete
**Remaining Integration**:
- [ ] Update imports to use new stack-core functions
- [ ] Remove duplicate logic from feature-stack.js

### Stack Playlist Module (`stack-playlist.ts`)
**Current Status**: ✅ Complete
**Remaining Integration**:
- [ ] Update imports to use new stack-core functions
- [ ] Remove duplicate logic from feature-stack.js

### Stack Poll Module (`stack-poll.ts`)
**Current Status**: ✅ Complete
**Remaining Integration**:
- [ ] Update imports to use new stack-core functions
- [ ] Remove duplicate logic from feature-stack.js

## Test Coverage Plan

### Unit Tests (Target: 80%+ coverage)
**stack-core.ts**:
- [ ] Stack shell creation and cleanup
- [ ] Panel bar and flyout operations
- [ ] Stack population logic
- [ ] Visibility toggle functionality
- [ ] Panel docking system
- [ ] Order saving/loading

**stack-motd.ts**:
- [ ] MOTD structure normalization
- [ ] Content detection and validation
- [ ] Stack panel adoption
- [ ] Visibility sync
- [ ] Observer wiring
- [ ] Socket handler integration

**stack-playlist.ts**:
- [ ] Add-media UI management
- [ ] Playlist controls merging
- [ ] Queue preview rendering
- [ ] Queue entry operations

**stack-poll.ts**:
- [ ] Poll detachment from playlist
- [ ] Poll button relocation
- [ ] Stack panel adoption
- [ ] Visibility sync
- [ ] Observer wiring
- [ ] Socket handler integration

### Integration Tests
**Cross-module communication**:
- [ ] Stack sub-domain coordination
- [ ] Visibility sync across domains
- [ ] Panel interaction flows

### E2E Tests (Using fixture server)
**User workflows**:
- [ ] Panel visibility toggling
- [ ] Panel docking/undocking
- [ ] Panel reordering
- [ ] MOTD content updates
- [ ] Poll creation and management
- [ ] Playlist queue management

## Implementation Timeline

### Week 1: Core Infrastructure
**Priority**: HIGH
**Tasks**:
1. Create `stack-core.ts` with extracted functionality
2. Move main stack shell logic to `stack-core.ts`
3. Update stack modules to use new core functions
4. Remove migrated functionality from `feature-stack.js`
5. Run existing tests to ensure no regressions

### Week 2: Advanced Features
**Priority**: MEDIUM
**Tasks**:
1. Move panel bar and flyout management to `stack-core.ts`
2. Move stack population logic to `stack-core.ts`
3. Move footer and UI integration to `stack-core.ts`
4. Move visibility and state management to `stack-core.ts`
5. Write unit tests for new core functionality

### Week 3: Testing & Validation
**Priority**: HIGH
**Tasks**:
1. Write comprehensive unit tests for all stack modules
2. Run integration tests for cross-module communication
3. Execute E2E tests using fixture server
4. Validate test coverage targets (80%+)
5. Fix any test failures or coverage gaps

### Week 4: Cleanup & Documentation
**Priority**: LOW
**Tasks**:
1. Remove remaining functionality from `feature-stack.js`
2. Update imports and references
3. Document extracted interfaces
4. Update README with new module structure
5. Final validation and deployment

## Risk Mitigation

### Technical Risks
1. **Logic Drift**: Ensure behavior-preserving extraction by comparing test outputs
2. **DOM Dependencies**: Maintain proper DOM element references across modules
3. **State Synchronization**: Ensure all modules share state correctly
4. **Error Handling**: Preserve existing error handling and safety checks

### Testing Risks
1. **Incomplete Coverage**: Write tests before refactoring to catch regressions
2. **Integration Issues**: Test cross-module communication thoroughly
3. **E2E Reliability**: Use existing fixture server for consistent testing
4. **Performance Impact**: Ensure extracted modules don't introduce performance regressions

## Success Criteria

### Code Quality
- [ ] `feature-stack.js` reduced to < 200 lines (from 2,096)
- [ ] Each stack module < 500 lines
- [ ] `stack-core.ts` contains shared infrastructure
- [ ] Clear separation of concerns between modules
- [ ] Comprehensive JSDoc documentation

### Test Coverage
- [ ] Unit test coverage: 80%+ for each stack module
- [ ] Integration test coverage: 90%+ for cross-module communication
- [ ] E2E test coverage: 100% for user workflows
- [ ] No regressions in existing functionality

### Functionality
- [ ] All existing features work identically
- [ ] Panel visibility toggles work correctly
- [ ] Panel docking/undocking works correctly
- [ ] Panel reordering works correctly
- [ ] MOTD content updates work correctly
- [ ] Poll creation and management works correctly
- [ ] Playlist queue management works correctly

## Dependencies

### External Dependencies
- [ ] CyTube global objects (`window.socket`, `window.BTFW`)
- [ ] DOM APIs (`MutationObserver`, `CSSStyleSheet`)
- [ ] Existing stack infrastructure (`GROUPS`, `SKIP_SELECTORS`)

### Internal Dependencies
- [ ] `src/lib/stack-core.ts` - Core stack infrastructure
- [ ] `src/lib/stack-poll-visibility.js` - Poll visibility utilities
- [ ] `src/lib/theme-admin-blocks.js` - Theme admin utilities
- [ ] `src/lib/escape-html.js` - HTML sanitization
- [ ] `src/modules/feature:layout.js` - Layout module
- [ ] `src/modules/util:templates.js` - Template utilities

## Rollback Plan

### If Issues Arise
1. **Version Control**: Maintain git history for all changes
2. **Feature Flags**: Use feature flags for gradual rollout
3. **Testing**: Run comprehensive test suite before deployment
4. **Monitoring**: Monitor for any regressions in production

### Emergency Rollback
1. **Git Revert**: Revert to previous commit if critical issues arise
2. **Feature Flag Disable**: Disable new functionality immediately
3. **Manual Testing**: Perform manual testing to identify issues
4. **Hotfix**: Create hotfix branch for urgent fixes

## Conclusion

This plan provides a comprehensive roadmap for completing the feature-stack.js split. By following this structured approach, we can:

1. Successfully extract all remaining functionality into focused modules
2. Maintain backward compatibility and existing functionality
3. Achieve high test coverage for all components
4. Reduce code complexity and improve maintainability
5. Enable future development with clear module boundaries

The key to success is careful, incremental implementation with thorough testing at each step. By following this plan, we can complete the feature-stack.js split while minimizing risk and ensuring quality.