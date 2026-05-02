import { Button } from '@statseeker/components/Layout';
import DropdownButton, { DropDownType } from '@statseeker/components/Legacy/DropdownButton/DropdownButton';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearch, Link } from '@tanstack/react-router';
import React from 'react';
import { type DiscoveryPanelContainerProps } from './DiscoveryPanelContainer';
import { discoverQueryOptions } from '~/lib';

type DiscoveryPanelFooterProps = Pick<DiscoveryPanelContainerProps, 'showAdvancedOptionsButton' | 'startButtonText'
    | 'onStartClick' | 'isRunning' | 'openSchedule' | 'onSaveConfig'> &
    Partial<Pick<DiscoveryPanelContainerProps, 'runPingDiscover'>> & {
        setShowAdvancedOptions: (showAdvanced: boolean) => void;
        showAdvancedOptions: boolean;
    };

const DiscoveryPanelFooter = (
    { showAdvancedOptionsButton,
        startButtonText = 'Start Discovery',
        onStartClick,
        isRunning = false,
        openSchedule,
        runPingDiscover,
        setShowAdvancedOptions,
        onSaveConfig,
        showAdvancedOptions }: DiscoveryPanelFooterProps) => {

    // Fetch current discovery status
    const currentDiscover = useSuspenseQuery(
        discoverQueryOptions.currentDiscoverQueryOptions({ refetchInterval: 15000 })
    ).data;

    const discoveryInProgress = currentDiscover && Object.keys(currentDiscover).length > 0;

    // Determine context from URL search params
    const search = useSearch({ strict: false });
    const isEditing = search?.from === 'schedule';
    const hasSchedule = search?.hasSchedule === true;
    const isRunFromHistory = search?.from === 'history';
    const isScheduleCustomize = isEditing || isRunFromHistory;


    // Toggle button for advanced options
    const renderAdvancedOptionsToggle = () => (
        <Button
            variant="outline"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
            {showAdvancedOptions ? 'Hide' : 'Show'} advanced options
        </Button>
    );

    // Schedule customization buttons (Cancel/Save)
    const renderScheduleButtons = () => (
        <>
            <Link to={`/${search.from}`} search={true}>
                <Button variant="solid">Cancel</Button>
            </Link>
            {isEditing && (
                <Button variant="outline" onClick={onSaveConfig}>
                    Save
                </Button>
            )}
        </>
    );

    // Action dropdown with Start and optional Schedule
    const renderActionDropdown = () => {
        const actions: DropDownType[] = [
            {
                buttonText: startButtonText,
                link: () => onStartClick(),
                disabled: discoveryInProgress,
            },
        ];

        if (runPingDiscover) {
            actions.push({
                buttonText: 'Dry Run',
                link: runPingDiscover,
                disabled: false,
            });
        }

        // Add Schedule option if applicable
        actions.push({
            buttonText: 'Save',
            link: () => isRunFromHistory && hasSchedule ? onSaveConfig() : openSchedule?.(),
            disabled: false,
        });

        return <DropdownButton buttonTypes={actions} />;
    };

    // Simple start button (no dropdown)
    const renderSimpleStartButton = () => (
        <Button
            isDisabled={discoveryInProgress}
            isLoading={isRunning}
            onClick={() => onStartClick()}
        >
            {startButtonText}
        </Button>
    );


    if (!showAdvancedOptionsButton) {
        return renderSimpleStartButton();
    }

    return (
        <React.Fragment>
            {!isScheduleCustomize && renderAdvancedOptionsToggle()}
            {isScheduleCustomize && renderScheduleButtons()}
            {!isEditing && renderActionDropdown()}
        </React.Fragment>
    );
};

export default DiscoveryPanelFooter;
