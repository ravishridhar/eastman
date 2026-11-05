<?php
declare(strict_types=1);

// Field identifiers and picklist values match the original live Drupal forms.
function salesforce_submission(string $type, array $values, array $config): array
{
    $stateCode = $config['stateCodes'][$values['state']] ?? null;
    if (!in_array($type, ['contact', 'partner'], true) || $stateCode === null) {
        throw new InvalidArgumentException('Invalid form type or state.');
    }
    $fields = [
        'oid' => $config['orgId'],
        'retURL' => $config['returnUrl'],
        'lead_source' => 'Website',
        'country_code' => 'IN',
        'state_code' => $stateCode,
        '00NdN00000CpzXB' => $type === 'contact' ? 'B2C' : 'B2B',
    ];
    foreach (array_merge($config['common'], $config[$type]) as $local => $salesforce) {
        $fields[$salesforce] = $values[$local] ?? '';
    }
    if ($type === 'partner') {
        // Preserve the additional consent field in Salesforce's standard description.
        $fields['description'] = 'Consent to be contacted about partnership: '
            . ($values['consent'] === 'yes' ? 'Yes' : 'No');
    }
    return ['action' => $config['endpoint'], 'fields' => $fields];
}
