<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Schemas\Schema;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Cache;
use BackedEnum;

class Settings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;
    protected static string|\UnitEnum|null $navigationGroup = 'Administration';
    protected static ?int $navigationSort = 4;
    protected string $view = 'filament.pages.settings';

    public ?array $data = [];

    public function mount(): void
    {
        // Load existing settings into form
        $settings = Setting::pluck('value', 'key')->toArray();
        $this->form->fill($settings);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('General Settings')->schema([
                    TextInput::make('store_name')->required(),
                    TextInput::make('store_email')->email()->required(),
                    TextInput::make('store_phone'),
                ])->columns(3),

                Section::make('Currency & Locale')->schema([
                    Select::make('currency')
                        ->options(['USD' => 'USD ($)', 'EUR' => 'EUR (€)', 'GBP' => 'GBP (£)'])
                        ->required(),
                    Select::make('timezone')
                        ->options(['UTC' => 'UTC', 'America/New_York' => 'EST', 'Europe/London' => 'GMT'])
                        ->required(),
                ])->columns(2),

                Section::make('Taxes & Shipping')->schema([
                    TextInput::make('tax_rate')
                        ->numeric()->suffix('%')->required(),
                    TextInput::make('flat_shipping_rate')
                        ->numeric()->prefix('$')->required(),
                ])->columns(2),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        // Clear settings cache
        Cache::forget('settings');

        Notification::make()
            ->title('Settings Saved')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save Settings')
                ->submit('save')
                ->keyBindings(['mod+s']),
        ];
    }
}
